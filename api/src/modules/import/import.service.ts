import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EntityPreprocessor } from '@api/modules/import/services/entity.preprocessor';
import {
  ExcelParserInterface,
  ExcelParserToken,
} from '@api/modules/import/services/excel-parser.interface';
import { ImportRepository } from '@api/modules/import/import.repostiory';
import { EventBus } from '@nestjs/cqrs';
import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';
import { ImportEvent } from '@api/modules/import/events/import.event';
import { DataSource } from 'typeorm';
import { DataIngestionExcelParser } from '@api/modules/import/parser/data-ingestion.xlsx-parser';
import { ProjectsService } from '@api/modules/projects/projects.service';
import { UploadDataFilesDto } from '@shared/dtos/users/upload-data-files.dto';
import { S3Service } from '@api/modules/import/s3.service';
import { UserUpload, UserUploadFile } from '@shared/entities/users/user-upload';
import { User } from '@shared/entities/users/user.entity';
import { Readable } from 'stream';
import { ModelComponentsVersionEntity } from '@shared/entities/model-versioning/model-components-version.entity';

@Injectable()
export class ImportService {
  logger: Logger = new Logger(ImportService.name);
  eventMap: any = {
    STARTED: API_EVENT_TYPES.EXCEL_IMPORT_STARTED,
    SUCCESS: API_EVENT_TYPES.EXCEL_IMPORT_SUCCESS,
    FAILED: API_EVENT_TYPES.EXCEL_IMPORT_FAILED,
  };

  constructor(
    private readonly dataIngestionParser: DataIngestionExcelParser,
    @Inject(ExcelParserToken)
    private readonly excelParser: ExcelParserInterface,
    private readonly importRepo: ImportRepository,
    private readonly preprocessor: EntityPreprocessor,
    private readonly eventBus: EventBus,
    private readonly dataSource: DataSource,
    private readonly projectsService: ProjectsService,
    private readonly s3Service: S3Service,
  ) {}

  async importProjectScorecard(fileBuffer: Buffer, userId: string) {
    this.logger.warn('Project scorecard file import started...');
    this.registerImportEvent(userId, this.eventMap.STARTED);
    try {
      const parsedSheets = await this.excelParser.parseExcel(fileBuffer);
      const parsedDBEntities =
        this.preprocessor.toProjectScorecardDbEntries(parsedSheets);

      await this.importRepo.importProjectScorecard(parsedDBEntities);

      this.logger.warn('Excel file import completed successfully');
      this.registerImportEvent(userId, this.eventMap.SUCCESS);
    } catch (e) {
      this.logger.error('Excel file import failed', e);
      this.registerImportEvent(userId, this.eventMap.FAILED);
    }
  }

  async import(
    fileBuffer: Buffer,
    userId: string,
    versionNotes?: string,
    versionName?: string,
    fileName?: string,
  ): Promise<void> {
    this.logger.warn('Excel file import started...');

    // Log version information if provided
    this.logger.warn(`Version name: ${versionName}`);
    if (versionNotes) {
      this.logger.warn(`Version notes: ${versionNotes}`);
    }

    this.registerImportEvent(userId, this.eventMap.STARTED);
    try {
      const parsedSheets =
        await this.dataIngestionParser.parseBuffer(fileBuffer);
      const parsedDBEntities =
        await this.preprocessor.toDbEntities(parsedSheets);
      await this.importRepo.ingest(parsedDBEntities);
      await this.projectsService.createFromExcel(parsedSheets.Projects);

      // Upload file to S3 under data-ingestion folder if fileName is provided
      let filePath: string | null = null;
      if (fileName) {
        const uploadDate = new Date();
        const s3Key = this.s3Service.generateDataIngestionS3Key(
          uploadDate,
          fileName,
        );
        await this.s3Service.uploadFile(
          s3Key,
          fileBuffer,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        filePath = s3Key;
      }

      // Create DataIngestionEntity record after successful import
      const dataIngestionRepo = this.dataSource.getRepository(
        ModelComponentsVersionEntity,
      );
      const dataIngestion = new ModelComponentsVersionEntity();
      dataIngestion.createdAt = new Date();
      dataIngestion.versionNotes = versionNotes;
      dataIngestion.versionName = versionName;
      dataIngestion.filePath = filePath;
      await dataIngestionRepo.save(dataIngestion);

      // Keep only the 3 most recent data ingestion records
      await this.cleanupOldDataIngestions();

      this.logger.warn('Excel file import completed successfully');
      this.registerImportEvent(userId, this.eventMap.SUCCESS);
    } catch (e) {
      this.logger.error('Excel file import failed', e);
      this.registerImportEvent(userId, this.eventMap.FAILED, {
        error: { type: e.constructor.name, message: e.message },
      });
      throw new ConflictException('The excel file could not be imported');
    }
  }

  registerImportEvent(
    userId: string,
    eventType: typeof this.eventMap,
    payload = {},
  ) {
    this.eventBus.publish(new ImportEvent(eventType, userId, payload));
  }

  async importDataProvidedByPartner(
    files: UploadDataFilesDto,
    userId: string,
  ): Promise<UserUpload> {
    this.logger.warn('importDataProvidedByPartner started...');
    this.registerImportEvent(userId, this.eventMap.STARTED);

    let userUpload = new UserUpload();
    const date = new Date();
    try {
      const preparedFiles = files.map((file, idx) => ({
        id: idx + 1,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        key: this.s3Service.generateS3Key(date, userId, file.originalname),
        buffer: file.buffer,
      }));

      userUpload.user = { id: userId } as User;
      userUpload.files = preparedFiles.map((file) => ({
        ...file,
        buffer: undefined,
      }));
      userUpload = await this.importRepo.createUserUpload(userUpload);
      await this.s3Service.uploadUserFiles(
        preparedFiles as unknown as UploadDataFilesDto,
      );

      this.logger.warn('importDataProvidedByPartner completed successfully');
      this.registerImportEvent(userId, this.eventMap.SUCCESS);
      return userUpload;
    } catch (e) {
      this.logger.error('importDataProvidedByPartner failed', e);
      this.registerImportEvent(userId, this.eventMap.FAILED, {
        error: { type: e.constructor.name, message: e.message },
      });
      this.importRepo.removeUserUpload(userUpload);

      throw new ConflictException(e.message);
    }
  }

  public async downloadUserUploadFile(
    userUploadId: number,
    fileId: number,
  ): Promise<[UserUploadFile, Readable]> {
    const userUpload = await this.importRepo.findUserUploadById(userUploadId);
    if (userUpload === null) {
      throw new NotFoundException('User upload not found');
    }

    const userUploadFile = userUpload.files.find((file) => file.id == fileId);
    if (!userUploadFile) {
      throw new NotFoundException('User upload file not found');
    }

    const fileStream = await this.s3Service.downloadFileByKey(
      userUploadFile.key,
    );
    if (!fileStream) {
      throw new InternalServerErrorException('File not found in directory');
    }
    return [userUploadFile, fileStream];
  }

  public async deleteUserUpload(id: number): Promise<void> {
    const userUpload = await this.importRepo.findUserUploadById(id);
    if (userUpload === null) {
      throw new NotFoundException('User upload not found');
    }

    await this.s3Service.deleteFilesByKeys(userUpload.files.map((f) => f.key));
    // User upload row is deleted by adminjs
    await this.importRepo.removeUserUpload(userUpload);
  }

  public async downloadDataIngestionFile(
    dataIngestionCreatedAt: Date,
  ): Promise<[string, Readable] | null> {
    const dataIngestionRepo = this.dataSource.getRepository(
      ModelComponentsVersionEntity,
    );
    const dataIngestion = await dataIngestionRepo.findOne({
      where: { createdAt: dataIngestionCreatedAt },
    });

    if (!dataIngestion || !dataIngestion.filePath) {
      throw new NotFoundException('Data ingestion file not found');
    }

    const fileStream = await this.s3Service.downloadDataIngestionFile(
      dataIngestion.filePath,
    );
    if (!fileStream) {
      throw new InternalServerErrorException('File not found in S3');
    }

    // Extract filename from the S3 path
    const fileName =
      dataIngestion.filePath.split('/').pop() || 'data-ingestion-file';

    return [fileName, fileStream];
  }

  private async cleanupOldDataIngestions(): Promise<void> {
    const dataIngestionRepo = this.dataSource.getRepository(
      ModelComponentsVersionEntity,
    );

    // Get all data ingestion records, ordered by createdAt desc
    const allDataIngestions = await dataIngestionRepo.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });

    // If we have more than 3, cleanup the oldest ones (keep files for only 3 most recent)
    if (allDataIngestions.length > 3) {
      const recordsToCleanup = allDataIngestions.slice(3); // Records beyond the 3 most recent

      // Delete S3 files for records that will be cleaned up
      const s3KeysToDelete = recordsToCleanup
        .filter((record) => record.filePath) // Only records with file paths
        .map((record) => record.filePath!);

      if (s3KeysToDelete.length > 0) {
        try {
          await this.s3Service.deleteFilesByKeys(s3KeysToDelete);
          this.logger.warn(
            `Deleted ${s3KeysToDelete.length} old data ingestion files from S3`,
          );
        } catch (error) {
          this.logger.error('Failed to delete old S3 files', error);
          // Continue with database cleanup even if S3 cleanup fails
        }
      }

      // Clear filePath for records beyond the 3 most recent (but keep the records)
      for (const record of recordsToCleanup) {
        if (record.filePath) {
          record.filePath = null;
          await dataIngestionRepo.save(record);
        }
      }

      this.logger.warn(
        `Cleaned up ${recordsToCleanup.length} old data ingestion files, keeping only files for the 3 most recent records`,
      );
    }
  }
}
