import { Controller, Get, Headers, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { adminContract } from '@shared/contracts/admin.contract';
import { AuthenticationService } from '@api/modules/auth/authentication.service';
import { ROLES } from '@shared/entities/users/roles.enum';
import { JwtCookieAuthGuard } from '@api/modules/auth/guards/jwt-cookie-auth.guard';
import { AdminExportService } from '@api/modules/admin/admin-export.service';

@Controller()
@UseGuards(JwtCookieAuthGuard, RolesGuard)
@RequiredRoles(ROLES.ADMIN)
export class AdminController {
  constructor(
    private readonly auth: AuthenticationService,
    private readonly adminExport: AdminExportService,
  ) {}

  @Get('admin/export/xlsx')
  async exportExcel(@Res() response: Response): Promise<void> {
    const workbook = await this.adminExport.exportToExcel();
    const date = new Date().toISOString().slice(0, 10);

    response.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="blue-carbon-dataset-${date}.xlsx"`,
      'Content-Length': String(workbook.length),
    });
    response.send(workbook);
  }

  @TsRestHandler(adminContract.addUser)
  async addUser(
    @Headers('origin') origin: string,
  ): Promise<ControllerResponse> {
    return tsRestHandler(adminContract.addUser, async ({ body }) => {
      await this.auth.addUser(origin, body);
      return {
        status: 201,
        body: null,
      };
    });
  }
}
