import {
  GUARDS_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { AdminController } from '@api/modules/admin/admin.controller';
import { JwtCookieAuthGuard } from '@api/modules/auth/guards/jwt-cookie-auth.guard';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { ROLES_KEY } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@shared/entities/users/roles.enum';

describe('AdminController Excel export', () => {
  it('registers the download route under the admin controller', () => {
    expect(
      Reflect.getMetadata(PATH_METADATA, AdminController.prototype.exportExcel),
    ).toBe('admin/export/xlsx');
    expect(
      Reflect.getMetadata(
        METHOD_METADATA,
        AdminController.prototype.exportExcel,
      ),
    ).toBe(0);
  });

  it('inherits JWT authentication and admin-role guards', () => {
    expect(Reflect.getMetadata(GUARDS_METADATA, AdminController)).toEqual([
      JwtCookieAuthGuard,
      RolesGuard,
    ]);
    expect(Reflect.getMetadata(ROLES_KEY, AdminController)).toEqual([
      ROLES.ADMIN,
    ]);
  });
});
