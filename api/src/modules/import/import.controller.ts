import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@shared/entities/users/roles.enum';
import { UploadXlsm } from '@api/modules/import/decorators/xlsm-upload.decorator';
import { ImportService } from '@api/modules/import/import.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { adminContract } from '@shared/contracts/admin.contract';
import { ControllerResponse } from '@api/types/controller-response.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import { GetUser } from '@api/modules/auth/decorators/get-user.decorator';
import { User } from '@shared/entities/users/user.entity';

@Controller()
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ImportController {
  constructor(private readonly service: ImportService) {}
  // TODO: File validation following:
  //       https://docs.nestjs.com/techniques/file-upload

  @TsRestHandler(adminContract.uploadFile)
  @UseInterceptors(FileInterceptor('file'))
  // @RequiredRoles(ROLES.ADMIN)
  async uploadFile(
    @UploadXlsm() file: Express.Multer.File,
    // @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(adminContract.uploadFile, async () => {
      const importedData = await this.service.import(file.buffer);
      return {
        status: 201,
        body: importedData,
      };
    });
  }
}
