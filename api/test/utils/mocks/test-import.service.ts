import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  EntityPreprocessor,
  ProjectScoreCardNotFoundError,
} from '@api/modules/import/services/entity.preprocessor';
import { API_EVENT_TYPES } from '@api/modules/api-events/events.enum';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { DataIngestionExcelParser } from '@api/modules/import/parser/data-ingestion.xlsx-parser';
import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectScoreUtils } from '@shared/entities/project-score.utils';
import { Project } from '@shared/entities/projects.entity';
import { ExcelProject } from '@api/modules/import/dtos/excel-projects.dto';
import {
  ParsedEntities,
  ParsedEntitiesWithSources,
} from '@api/modules/import/services/parsed-db-entities.type';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity';
import { FeasibilityAnalysis } from '@shared/entities/cost-inputs/feasability-analysis.entity';
import { ConservationPlanningAndAdmin } from '@shared/entities/cost-inputs/conservation-and-planning-admin.entity';
import { DataCollectionAndFieldCosts } from '@shared/entities/cost-inputs/data-collection-and-field-costs.entity';
import { CommunityRepresentation } from '@shared/entities/cost-inputs/community-representation.entity';
import { BlueCarbonProjectPlanning } from '@shared/entities/cost-inputs/blue-carbon-project-planning.entity';
import { CarbonRights } from '@shared/entities/cost-inputs/establishing-carbon-rights.entity';
import { FinancingCost } from '@shared/entities/cost-inputs/financing-cost.entity';
import { ValidationCost } from '@shared/entities/cost-inputs/validation.entity';
import { MonitoringCost } from '@shared/entities/cost-inputs/monitoring.entity';
import { Maintenance } from '@shared/entities/cost-inputs/maintenance.entity';
import { CommunityBenefitSharingFund } from '@shared/entities/cost-inputs/community-benefit-sharing-fund.entity';
import { BaselineReassessment } from '@shared/entities/cost-inputs/baseline-reassessment.entity';
import { MRV } from '@shared/entities/cost-inputs/mrv.entity';
import { LongTermProjectOperating } from '@shared/entities/cost-inputs/long-term-project-operating.entity';
import { CarbonStandardFees } from '@shared/entities/cost-inputs/carbon-standard-fees.entity';
import { CommunityCashFlow } from '@shared/entities/cost-inputs/community-cash-flow.entity';
import { ImplementationLaborCost } from '@shared/entities/cost-inputs/implementation-labor-cost.entity';
import { EcosystemExtent } from '@shared/entities/carbon-inputs/ecosystem-extent.entity';
import { EcosystemLoss } from '@shared/entities/carbon-inputs/ecosystem-loss.entity';
import { RestorableLand } from '@shared/entities/carbon-inputs/restorable-land.entity';
import { SequestrationRate } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { MethodologySourcesConfig } from '@shared/config/methodology.config';
import { ModelComponentSourceM2M } from '@shared/entities/methodology/model-source-m2m.entity';
import {
  ExcelParserInterface,
  ExcelParserToken,
} from '@api/modules/import/services/excel-parser.interface';
import { ImportRepository } from '@api/modules/import/import.repostiory';
import { EventBus } from '@nestjs/cqrs';
import { ProjectsService } from '@api/modules/projects/projects.service';
import { UploadDataFilesDto } from '@shared/dtos/users/upload-data-files.dto';
import { UserUpload, UserUploadFile } from '@shared/entities/users/user-upload';
import { User } from '@shared/entities/users/user.entity';
import { S3Service } from '@api/modules/import/s3.service';
import { Readable } from 'stream';
import { ModelComponentsVersionEntity } from '@shared/entities/model-versioning/model-components-version.entity';

@Injectable()
export class TestImportService {
  logger: Logger = new Logger(TestImportService.name);
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
    @InjectRepository(ProjectScorecard)
    private readonly projectScoreCardRepository: Repository<ProjectScorecard>,
    private readonly s3Service: S3Service,
  ) {}

  async importProjectScorecard(fileBuffer: Buffer, userId: string) {
    this.logger.warn('Project scorecard file import started...');
    try {
      const parsedSheets = await this.excelParser.parseExcel(fileBuffer);
      const parsedDBEntities =
        this.preprocessor.toProjectScorecardDbEntries(parsedSheets);

      await this.importRepo.importProjectScorecard(parsedDBEntities);

      this.logger.warn('Excel file import completed successfully');
    } catch (e) {
      this.logger.error('Excel file import failed', e);
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

    try {
      const parsedSheets =
        await this.dataIngestionParser.parseBuffer(fileBuffer);
      const parsedDBEntities =
        await this.preprocessor.toDbEntities(parsedSheets);
      const parsedProjects = await this.processProjects(parsedSheets.Projects);
      const parsedEntitiesWithProjects = parsedDBEntities as ParsedEntities & {
        projects: any;
      };
      parsedEntitiesWithProjects.projects = {
        entity: Project,
        records: parsedProjects,
      };
      await this.ingestForTests(parsedEntitiesWithProjects);

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
    } catch (e) {
      this.logger.error('Excel file import failed', e);
      throw new ConflictException('The excel file could not be imported');
    }
  }

  private async processProjects(raw: ExcelProject[]) {
    return await Promise.all(
      raw.map(async (row: ExcelProject) => {
        const projectName = row.project_name;
        const ecosystem = row.ecosystem;
        const country_code = row.country_code;

        const projectScoreCard =
          await this.projectScoreCardRepository.findOneBy({
            countryCode: country_code,
            ecosystem,
          });
        if (projectScoreCard === null) {
          throw new ProjectScoreCardNotFoundError(projectName);
        }
        const scoreCardRating =
          ProjectScoreUtils.computeProjectScoreCardRating(projectScoreCard);

        const project = new Project();
        project.projectName = projectName;
        project.countryCode = country_code;
        project.ecosystem = ecosystem;
        project.activity = row.activity;
        project.restorationActivity = row.activity_type;
        project.projectSize = row.project_size_ha;
        project.projectSizeFilter = row.project_size_filter;
        project.abatementPotential = row.project_abatement_potential;
        project.countryAbatementPotential = row.country_abatement_potential;
        project.opexNPV = row.opex_npv;
        project.opex = row.opex;
        project.capexNPV = row.capex_npv;
        project.capex = row.capex;
        project.totalCostNPV = row.total_cost_npv;
        project.totalCost = row.total_cost;
        project.costPerTCO2eNPV = row.cost_per_tco2e_npv;
        project.costPerTCO2e = row.cost_per_tco2e;
        project.initialPriceAssumption = row.initial_price_assumption;
        project.priceType = row.price_type;
        project.feasibilityAnalysisNPV = row.feasibility_analysis_npv;
        project.feasibilityAnalysis = row.feasibility_analysis;
        project.conservationPlanningNPV = row.conservation_planning_npv;
        project.conservationPlanning = row.conservation_planning;
        project.dataCollectionNPV = row.data_collection_npv;
        project.dataCollection = row.data_collection;
        project.communityRepresentationNPV = row.community_representation_npv;
        project.communityRepresentation = row.community_representation;
        project.blueCarbonProjectPlanningNPV =
          row.blue_carbon_project_planning_npv;
        project.blueCarbonProjectPlanning = row.blue_carbon_project_planning;
        project.establishingCarbonRightsNPV =
          row.establishing_carbon_rights_npv;
        project.establishingCarbonRights = row.establishing_carbon_rights;
        project.validationNPV = row.validation_npv;
        project.validation = row.validation;
        project.implementationLaborNPV = row.implementation_labor_npv;
        project.implementationLabor = row.implementation_labor;
        project.monitoringNPV = row.monitoring_npv;
        project.maintenanceNPV = row.maintenance_npv;
        project.monitoring = row.monitoring;
        project.maintenance = row.maintenance;
        project.monitoringMaintenanceNPV = row.monitoring_maintenance_npv;
        project.monitoringMaintenance = row.monitoring_maintenance;
        project.communityBenefitNPV = row.community_benefit_npv;
        project.communityBenefit = row.community_benefit;
        project.carbonStandardFeesNPV = row.carbon_standard_fees_npv;
        project.carbonStandardFees = row.carbon_standard_fees;
        project.baselineReassessmentNPV = row.baseline_reassessment_npv;
        project.baselineReassessment = row.baseline_reassessment;
        project.mrvNPV = row.mrv_npv;
        project.mrv = row.mrv;
        project.longTermProjectOperatingNPV =
          row.long_term_project_operating_npv;
        project.longTermProjectOperating = row.long_term_project_operating;
        project.leftoverAfterOpex = row.leftover_after_opex;
        project.leftoverAfterOpexNPV = row.leftover_after_opex_NPV;
        project.totalRevenue = row.total_revenue;
        project.totalRevenueNPV = row.total_revenu_npv;
        project.creditsIssued = row.credits_issued;
        project.scoreCardRating = scoreCardRating;
        return project;
      }),
    );
  }

  public async ingestForTests(parsedEntities: ParsedEntities) {
    await this.dataSource.transaction('READ COMMITTED', async (manager) => {
      // DATA WIPE STARTS
      await manager.clear(Project);
      await manager.clear(ProjectSize);
      await manager.clear(FeasibilityAnalysis);
      await manager.clear(ConservationPlanningAndAdmin);
      await manager.clear(DataCollectionAndFieldCosts);
      await manager.clear(CommunityRepresentation);
      await manager.clear(BlueCarbonProjectPlanning);
      await manager.clear(CarbonRights);
      await manager.clear(FinancingCost);
      await manager.clear(ValidationCost);
      await manager.clear(MonitoringCost);
      await manager.clear(Maintenance);
      await manager.clear(CommunityBenefitSharingFund);
      await manager.clear(BaselineReassessment);
      await manager.clear(MRV);
      await manager.clear(LongTermProjectOperating);
      await manager.clear(CarbonStandardFees);
      await manager.clear(CommunityCashFlow);
      await manager.clear(ImplementationLaborCost);

      // Carbon inputs ingestion
      await manager.clear(EcosystemExtent);
      await manager.clear(EcosystemLoss);
      await manager.clear(RestorableLand);
      await manager.clear(SequestrationRate);
      await manager.delete(EmissionFactors, {});

      // Other tables ingestion
      await manager.clear(BaseSize);
      await manager.clear(BaseIncrease);
      await manager.clear(ModelAssumptions);
      await manager.delete(ModelComponentSource, {});
      // DATA WIPE ENDS

      // CREATION STARTS
      const modelComponentSources = await manager.save(
        parsedEntities.modelComponentSources.records,
      );

      const entitiesWithSources = MethodologySourcesConfig.map(
        (entityConfig) => entityConfig.entity,
      );

      const classifiedEntities = Object.keys(parsedEntities).reduce(
        (acc, key) => {
          if (
            entitiesWithSources.includes(parsedEntities[key].entity) === false
          ) {
            acc.withoutSources[key] = parsedEntities[key];
            return acc;
          }

          const entityConfig = MethodologySourcesConfig.find(
            (entry) => entry.entity === parsedEntities[key].entity,
          )!;
          if (entityConfig.relationshipType === '1n') {
            acc.with1nSources[key] = parsedEntities[key];
          } else if (entityConfig.relationshipType === 'm2m') {
            acc.withM2mSources[key] = parsedEntities[key];
          }

          return acc;
        },
        {
          withoutSources: {},
          with1nSources: {},
          withM2mSources: {},
        } as any,
      );
      await this.saveParsedEntities(manager, classifiedEntities.withoutSources);

      const m2mEntitiesWithIds = await this.saveParsedEntities(
        manager,
        classifiedEntities.withM2mSources,
      );

      const parsedEntitiesWithSources = this.addComponentSourcesRelationships(
        {
          ...m2mEntitiesWithIds,
          ...classifiedEntities.with1nSources,
        },
        modelComponentSources,
      );

      await this.saveParsedEntities(manager, parsedEntitiesWithSources);
      // CREATION ENDS
    });
  }

  private async saveParsedEntities(
    entity: EntityManager,
    parsedEntities: Partial<ParsedEntities>,
  ): Promise<Partial<ParsedEntities>> {
    const response = {} as ParsedEntities;
    for (const parsedEntityKey of Object.keys(parsedEntities)) {
      response[parsedEntityKey] = {
        entity: parsedEntities[parsedEntityKey].entity,
        records: await entity.save(parsedEntities[parsedEntityKey].records),
      };
    }

    return response;
  }

  private addComponentSourcesRelationships(
    parsedEntities: Partial<ParsedEntities>,
    modelComponentSources: ModelComponentSource[],
  ): Partial<ParsedEntitiesWithSources> {
    const parsedEntitiesWithSources = {
      modelComponentSourceM2M: {
        entity: ModelComponentSourceM2M,
        records: [],
      },
    };

    const componentSourceIdByName: { [name: string]: string } =
      modelComponentSources.reduce((acc, value) => {
        acc[value.name] = value.id;
        return acc;
      }, {});

    // Mapping parsed entities to a methodology config entry at runtime
    const parsedEntityKeys = Object.keys(
      parsedEntities,
    ) as (keyof ParsedEntities)[];
    for (const entityKey of parsedEntityKeys) {
      const parsedEntity = parsedEntities[entityKey];

      const entityConfig = MethodologySourcesConfig.find(
        (entry) => entry.entity.name === parsedEntity.entity.name,
      );
      if (entityConfig === undefined) continue;

      if (entityConfig.relationshipType === '1n') {
        for (const record of parsedEntity.records) {
          const recordSource = record['source'];
          if (recordSource === undefined) continue;

          const sourceName = record['source']['name'];
          const sourceId = componentSourceIdByName[sourceName];
          if (sourceId === undefined)
            throw new Error(
              `SourceId for SourceName '${sourceName}' not found`,
            );

          record['source'] = {
            id: componentSourceIdByName[sourceName],
          };
        }
        parsedEntitiesWithSources[entityKey] = parsedEntity;
      } else if (entityConfig.relationshipType === 'm2m') {
        for (const record of parsedEntity.records) {
          if (Array.isArray(record.sources) === false) continue;

          for (const recordSource of record.sources) {
            const sourceId = componentSourceIdByName[recordSource.sourceName];
            if (sourceId === undefined)
              throw new Error(
                `SourceId for SourceName '${recordSource.sourceName}' not found`,
              );

            const m2mRelationship = new ModelComponentSourceM2M();
            m2mRelationship.source = {
              id: sourceId,
            } as unknown as ModelComponentSource;
            m2mRelationship.entityName = entityConfig.entity.name;
            m2mRelationship.entityId = record.id as string;
            m2mRelationship.sourceType = recordSource.fieldName;
            parsedEntitiesWithSources.modelComponentSourceM2M.records.push(
              m2mRelationship,
            );
          }
        }
      }
    }
    return parsedEntitiesWithSources;
  }

  async importDataProvidedByPartner(
    files: UploadDataFilesDto,
    userId: string,
  ): Promise<UserUpload> {
    this.logger.warn('importDataProvidedByPartner started...');
    // this.registerImportEvent(userId, this.eventMap.STARTED);

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
      // this.registerImportEvent(userId, this.eventMap.SUCCESS);
      return userUpload;
    } catch (e) {
      this.logger.error('importDataProvidedByPartner failed', e);
      // this.registerImportEvent(userId, this.eventMap.FAILED, {
      //   error: { type: e.constructor.name, message: e.message },
      // });
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
