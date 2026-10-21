import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTotalCostBreakevenPriceType1770000000001
  implements MigrationInterface
{
  name = 'AddTotalCostBreakevenPriceType1770000000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    const columns = await queryRunner.query(`
      SELECT table_ns.nspname AS table_schema,
             type_ns.nspname AS enum_schema,
             enum_type.typname AS enum_name
      FROM pg_attribute column_info
      JOIN pg_class table_info ON table_info.oid = column_info.attrelid
      JOIN pg_namespace table_ns ON table_ns.oid = table_info.relnamespace
      JOIN pg_type enum_type ON enum_type.oid = column_info.atttypid
      JOIN pg_namespace type_ns ON type_ns.oid = enum_type.typnamespace
      WHERE table_ns.nspname = 'public'
        AND table_info.relname = 'projects'
        AND column_info.attname = 'price_type'
        AND column_info.attnum > 0
        AND NOT column_info.attisdropped
        AND enum_type.typtype = 'e'
    `);

    if (
      columns.length !== 1 ||
      columns[0].enum_schema !== 'public' ||
      columns[0].enum_name !== 'projects_price_type_enum'
    ) {
      throw new Error(
        'Expected public.projects.price_type to use public.projects_price_type_enum; refusing enum migration.',
      );
    }

    const labels = await queryRunner.query(
      `
        SELECT enum_value.enumlabel
        FROM pg_enum enum_value
        JOIN pg_type enum_type ON enum_type.oid = enum_value.enumtypid
        JOIN pg_namespace type_ns ON type_ns.oid = enum_type.typnamespace
        WHERE type_ns.nspname = $1 AND enum_type.typname = $2
        ORDER BY enum_value.enumsortorder
      `,
      [columns[0].enum_schema, columns[0].enum_name],
    );
    const existingLabels = labels.map(
      ({ enumlabel }: { enumlabel: string }) => enumlabel,
    );
    const allowedLabels = new Set([
      'Opex breakeven',
      'Market price',
      'Total cost breakeven',
    ]);

    if (
      !existingLabels.includes('Opex breakeven') ||
      !existingLabels.some((label) =>
        ['Market price', 'Total cost breakeven'].includes(label),
      ) ||
      existingLabels.some((label) => !allowedLabels.has(label))
    ) {
      throw new Error(
        `Unexpected labels on public.projects_price_type_enum: ${existingLabels.join(', ')}; refusing enum migration.`,
      );
    }

    const viewDependencies = await queryRunner.query(`
      SELECT 1
      FROM pg_attribute column_info
      JOIN pg_class table_info ON table_info.oid = column_info.attrelid
      JOIN pg_namespace table_ns ON table_ns.oid = table_info.relnamespace
      JOIN pg_depend dependency
        ON dependency.refobjid = table_info.oid
       AND dependency.refobjsubid = column_info.attnum
      JOIN pg_rewrite rewrite_rule ON rewrite_rule.oid = dependency.objid
      JOIN pg_class view_info
        ON view_info.oid = rewrite_rule.ev_class
       AND view_info.relkind IN ('v', 'm')
      JOIN pg_namespace view_ns ON view_ns.oid = view_info.relnamespace
      WHERE table_ns.nspname = 'public'
        AND table_info.relname = 'projects'
        AND column_info.attname = 'price_type'
        AND view_ns.nspname = 'public'
        AND view_info.relname = 'project_scorecard_view'
      LIMIT 1
    `);

    if (viewDependencies.length !== 1) {
      throw new Error(
        'Expected public.project_scorecard_view to depend on public.projects.price_type; refusing enum migration.',
      );
    }

    if (!existingLabels.includes('Total cost breakeven')) {
      await queryRunner.query(
        `ALTER TYPE "public"."projects_price_type_enum" ADD VALUE 'Total cost breakeven'`,
      );
    }
  }

  async down(): Promise<void> {
    throw new Error(
      'Removing an enum label can invalidate stored project values; rollback requires a separately reviewed data migration.',
    );
  }
}
