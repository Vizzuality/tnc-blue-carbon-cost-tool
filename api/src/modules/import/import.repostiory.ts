import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Project } from '@shared/entities/projects.entity';
import { ProjectSize } from '@shared/entities/cost-inputs/project-size.entity';
import { FeasibilityAnalysis } from '@shared/entities/cost-inputs/feasability-analysis.entity';
import { EcosystemExtent } from '@shared/entities/carbon-inputs/ecosystem-extent.entity';
import { EcosystemLoss } from '@shared/entities/carbon-inputs/ecosystem-loss.entity';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity';
import { RestorableLand } from '@shared/entities/carbon-inputs/restorable-land.entity';
import { SequestrationRate } from '@shared/entities/carbon-inputs/sequestration-rate.entity';
import { BaselineReassessment } from '@shared/entities/cost-inputs/baseline-reassessment.entity';
import { BlueCarbonProjectPlanning } from '@shared/entities/cost-inputs/blue-carbon-project-planning.entity';
import { CarbonStandardFees } from '@shared/entities/cost-inputs/carbon-standard-fees.entity';
import { CommunityBenefitSharingFund } from '@shared/entities/cost-inputs/community-benefit-sharing-fund.entity';
import { CommunityCashFlow } from '@shared/entities/cost-inputs/community-cash-flow.entity';
import { CommunityRepresentation } from '@shared/entities/cost-inputs/community-representation.entity';
import { ConservationPlanningAndAdmin } from '@shared/entities/cost-inputs/conservation-and-planning-admin.entity';
import { DataCollectionAndFieldCosts } from '@shared/entities/cost-inputs/data-collection-and-field-costs.entity';
import { CarbonRights } from '@shared/entities/cost-inputs/establishing-carbon-rights.entity';
import { FinancingCost } from '@shared/entities/cost-inputs/financing-cost.entity';
import { LongTermProjectOperating } from '@shared/entities/cost-inputs/long-term-project-operating.entity';
import { Maintenance } from '@shared/entities/cost-inputs/maintenance.entity';
import { MonitoringCost } from '@shared/entities/cost-inputs/monitoring.entity';
import { MRV } from '@shared/entities/cost-inputs/mrv.entity';
import { ValidationCost } from '@shared/entities/cost-inputs/validation.entity';
import { ImplementationLaborCost } from '@shared/entities/cost-inputs/implementation-labor-cost.entity';
import { BaseIncrease } from '@shared/entities/base-increase.entity';
import { BaseSize } from '@shared/entities/base-size.entity';
import { ModelAssumptions } from '@shared/entities/model-assumptions.entity';
import { ProjectScorecard } from '@shared/entities/project-scorecard.entity';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity';
import {
  ParsedEntities,
  ParsedEntitiesWithSources,
} from '@api/modules/import/services/parsed-db-entities.type';
import { MethodologySourcesConfig } from '@shared/config/methodology.config';
import { ModelComponentSourceM2M } from '@shared/entities/methodology/model-source-m2m.entity';
import { UserUpload } from '@shared/entities/users/user-upload';

type ClassifiedEntities = {
  withoutSources: Partial<ParsedEntities>;
  with1nSources: Partial<ParsedEntities>;
  withM2mSources: Partial<ParsedEntities>;
};

@Injectable()
export class ImportRepository {
  constructor(private readonly dataSource: DataSource) {}

  async importProjectScorecard(projectScorecards: ProjectScorecard[]) {
    return this.dataSource.transaction('READ COMMITTED', async (manager) => {
      // Wipe current project scorecards
      await manager.clear(ProjectScorecard);

      // Insert
      await manager.save(projectScorecards);
    });
  }

  public async ingest(parsedEntities: ParsedEntities) {
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
        } as ClassifiedEntities,
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

  public async createUserUpload(userUpload: UserUpload) {
    return this.dataSource.getRepository(UserUpload).save(userUpload);
  }

  public async removeUserUpload(userUpload: UserUpload) {
    return this.dataSource.getRepository(UserUpload).remove(userUpload);
  }

  public async findUserUploadById(userUploadId: number) {
    return this.dataSource
      .getRepository(UserUpload)
      .findOneBy({ id: userUploadId });
  }
}
