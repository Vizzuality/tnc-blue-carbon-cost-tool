import { MethodologySourcesConfig } from '@shared/config/methodology.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { MethodologySourcesDto } from '@shared/dtos/methodology/methodology-sources.dto';
import { DataSource } from 'typeorm';

export class MethodologyRepository {
  private oneToNSourcesSql: string = '';
  private manyToManySourcesSql: string = '';

  public constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.preComputeSourcesSql();
  }

  private preComputeSourcesSql(): void {
    for (const sourceConfig of MethodologySourcesConfig) {
      const entityMetadata = this.dataSource.getMetadata(sourceConfig.entity);
      if (sourceConfig.relationshipType === '1n') {
        this.oneToNSourcesSql += `
        SELECT 
            '${sourceConfig.category}' AS category, 
            '${sourceConfig.label}' AS name, 
            JSONB_AGG(sources) AS sources
        FROM (
            SELECT DISTINCT ON (t1.name) t1.name, t1.id
            FROM model_component_sources t1
            INNER JOIN ${entityMetadata.tableName} t2 ON t2.source_id = t1.id
            ORDER BY t1.name
        ) AS sources UNION ALL`;
      } else if (sourceConfig.relationshipType === 'm2m') {
        this.manyToManySourcesSql += `
        SELECT
            '${sourceConfig.category}' AS category, 
            '${sourceConfig.label}' AS name, 
            JSONB_OBJECT_AGG(sources_subquery.source_type, sources_subquery.sources) AS sources
        FROM
        (
            SELECT 
                source_distinct.source_type,
            JSONB_AGG(
                JSONB_BUILD_OBJECT('name', source_distinct.name, 'id', source_distinct.id)
                ORDER BY source_distinct.name
            ) AS sources
            FROM (
                SELECT DISTINCT ON (t2.source_type, t1.id) 
                    t2.source_type, 
                    t1.name, 
                    t1.id
                FROM model_component_sources t1
                INNER JOIN model_component_source_m2m t2 
                    ON t2.source_id = t1.id 
                    AND t2.entity_name = '${entityMetadata.name}'
                ORDER BY t2.source_type, t1.id, t1.name
            ) AS source_distinct
            GROUP BY source_distinct.source_type
        ) AS sources_subquery UNION ALL`;
      }
    }
    if (this.manyToManySourcesSql === '') {
      this.oneToNSourcesSql = this.oneToNSourcesSql.slice(0, -10);
    }
    this.manyToManySourcesSql = this.manyToManySourcesSql.slice(0, -10);
  }

  public async getModelComponentSources(): Promise<MethodologySourcesDto> {
    const sql = `
SELECT category, JSONB_AGG(JSONB_BUILD_OBJECT('name', name, 'sources', sources) ORDER BY name) AS "sourcesByComponentName"
FROM (
    ${this.oneToNSourcesSql}
    ${this.manyToManySourcesSql}
) as joint_sources
GROUP BY category
ORDER BY category`;
    return this.dataSource.query(sql);
  }
}
