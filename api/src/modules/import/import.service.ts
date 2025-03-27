import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
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
import {
  userDataConservationInputMapJsonToEntity,
  userDataCostInputsMapJsonToEntity,
  userDataRestorationInputMapJsonToEntity,
} from '@api/modules/import/services/user-data-parser';
import { UserUploadCostInputs } from '@shared/entities/users/user-upload-cost-inputs.entity';
import { UserUploadRestorationInputs } from '@shared/entities/users/user-upload-restoration-inputs.entity';
import { UserUploadConservationInputs } from '@shared/entities/users/user-upload-conservation-inputs.entity';
import { DataIngestionExcelParser } from '@api/modules/import/parser/data-ingestion.xlsx-parser';
import { UploadDataFilesDto } from '@shared/dtos/users/upload-data-files.dto';
import { UserXlsxTemplatesParser } from '@api/modules/import/services/user-xlsx-templates.parser';
import { ZodError, ZodIssue } from 'zod';
import { ProjectsService } from '@api/modules/projects/projects.service';

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
    private readonly userXlsxTemplatesParser: UserXlsxTemplatesParser,
    private readonly importRepo: ImportRepository,
    private readonly preprocessor: EntityPreprocessor,
    private readonly eventBus: EventBus,
    private readonly dataSource: DataSource,
    private readonly projectsService: ProjectsService,
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
  ): Promise<[ZodIssue[] | undefined, any]> {
    this.logger.warn('importDataProvidedByPartner started...');
    this.registerImportEvent(userId, this.eventMap.STARTED);

    try {
      const { costInputs, carbonInputs } =
        await this.userXlsxTemplatesParser.parse(files);

      await this.dataSource.transaction(async (manager) => {
        if (costInputs) {
          const mappedCostInputs = userDataCostInputsMapJsonToEntity(
            costInputs,
            userId,
          );

          const userCostInputsRepo =
            manager.getRepository(UserUploadCostInputs);
          await userCostInputsRepo.save(mappedCostInputs);
        }

        if (carbonInputs) {
          const mappedRestorationInputs =
            userDataRestorationInputMapJsonToEntity(
              carbonInputs.restoration,
              userId,
            );
          const mappedConservationInputs =
            userDataConservationInputMapJsonToEntity(
              carbonInputs.conservation,
              userId,
            );

          const userRestorationInputsRepo = manager.getRepository(
            UserUploadRestorationInputs,
          );
          const userConservationInputsRepo = manager.getRepository(
            UserUploadConservationInputs,
          );
          await userRestorationInputsRepo.save(mappedRestorationInputs);
          await userConservationInputsRepo.save(mappedConservationInputs);
        }
      });

      this.logger.warn('importDataProvidedByPartner completed successfully');
      this.registerImportEvent(userId, this.eventMap.SUCCESS);
      return [undefined, carbonInputs];
    } catch (e) {
      this.logger.error('importDataProvidedByPartner failed', e);
      this.registerImportEvent(userId, this.eventMap.FAILED, {
        error: { type: e.constructor.name, message: e.message },
      });

      if (e instanceof ZodError) return [e.errors, undefined];
      throw new ConflictException(e.message);
    }
  }
}
