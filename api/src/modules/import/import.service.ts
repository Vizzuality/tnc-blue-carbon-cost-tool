import { Inject, Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class ImportService {
  logger: Logger = new Logger(ImportService.name);
  eventMap: any = {
    STARTED: API_EVENT_TYPES.EXCEL_IMPORT_STARTED,
    SUCCESS: API_EVENT_TYPES.EXCEL_IMPORT_SUCCESS,
    FAILED: API_EVENT_TYPES.EXCEL_IMPORT_FAILED,
  };

  constructor(
    @Inject(ExcelParserToken)
    private readonly excelParser: ExcelParserInterface,
    private readonly importRepo: ImportRepository,
    private readonly preprocessor: EntityPreprocessor,
    private readonly eventBus: EventBus,
    private readonly dataSource: DataSource,
  ) {}

  async import(fileBuffer: Buffer, userId: string) {
    this.logger.warn('Excel file import started...');
    this.registerImportEvent(userId, this.eventMap.STARTED);
    try {
      const parsedSheets = await this.excelParser.parseExcel(fileBuffer);
      const parsedDBEntities = this.preprocessor.toDbEntities(parsedSheets);
      await this.importRepo.ingest(parsedDBEntities);
      this.logger.warn('Excel file import completed successfully');
      this.registerImportEvent(userId, this.eventMap.SUCCESS);
    } catch (e) {
      this.logger.error('Excel file import failed', e);
      this.registerImportEvent(userId, this.eventMap.FAILED);
    }
  }

  registerImportEvent(userId: string, eventType: typeof this.eventMap) {
    this.eventBus.publish(new ImportEvent(eventType, userId, {}));
  }

  async importDataProvidedByPartner(fileBuffers: Buffer[], userId: string) {
    // TODO: Debt, add event handling
    const { costInputs, carbonInputs } =
      await this.excelParser.parseUserExcels(fileBuffers);
    const mappedCostInputs = userDataCostInputsMapJsonToEntity(
      costInputs,
      userId,
    );
    const mappedRestorationInputs = userDataRestorationInputMapJsonToEntity(
      carbonInputs.restoration,
      userId,
    );
    const mappedConservationInputs = userDataConservationInputMapJsonToEntity(
      carbonInputs.conservation,
      userId,
    );
    await this.dataSource.transaction(async (manager) => {
      const userCostInputsRepo = manager.getRepository(UserUploadCostInputs);
      const userRestorationInputsRepo = manager.getRepository(
        UserUploadRestorationInputs,
      );
      const userConservationInputsRepo = manager.getRepository(
        UserUploadConservationInputs,
      );
      await userCostInputsRepo.save(mappedCostInputs);
      await userRestorationInputsRepo.save(mappedRestorationInputs);
      await userConservationInputsRepo.save(mappedConservationInputs);
    });
    //
    return carbonInputs;
  }
}
