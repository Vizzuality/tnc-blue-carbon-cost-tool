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

  async import(fileBuffer: Buffer, userId: string): Promise<void> {
    this.logger.warn('Excel file import started...');
    this.registerImportEvent(userId, this.eventMap.STARTED);
    try {
      const parsedSheets =
        await this.dataIngestionParser.parseBuffer(fileBuffer);
      const parsedDBEntities =
        await this.preprocessor.toDbEntities(parsedSheets);
      await this.importRepo.ingest(parsedDBEntities);
      await this.projectsService.createFromExcel(parsedSheets.Projects);
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
}
