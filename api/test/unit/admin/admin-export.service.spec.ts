import { DataSource } from 'typeorm';
import { read, utils } from 'xlsx';
import { AdminExportService } from '@api/modules/admin/admin-export.service';
import { Country } from '@shared/entities/country.entity';

describe('AdminExportService', () => {
  it('exports input records into an XLSX workbook', async () => {
    const getRepository = jest.fn().mockImplementation((entity) => ({
      find: jest
        .fn()
        .mockResolvedValue(
          entity === Country ? [{ code: 'USA', name: 'United States' }] : [],
        ),
    }));
    const service = new AdminExportService({
      getRepository,
    } as unknown as DataSource);

    const workbookBuffer = await service.exportToExcel();
    const workbook = read(workbookBuffer, { type: 'buffer' });
    const countries = utils.sheet_to_json(workbook.Sheets.Countries);

    expect(workbook.SheetNames).toContain('Countries');
    expect(countries).toEqual([{ code: 'USA', name: 'United States' }]);
    expect(workbook.SheetNames).not.toContain('Users');
  });
});
