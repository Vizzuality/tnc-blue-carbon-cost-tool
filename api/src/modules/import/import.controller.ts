import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@api/modules/auth/roles.enum';
import { UploadXlsm } from '@api/modules/import/decorators/xlsm-upload.decorator';

@Controller()
//@UseInterceptors(JwtAuthGuard, RolesGuard)
export class ImportController {
  // TODO: File validation following:
  //       https://docs.nestjs.com/techniques/file-upload

  @Post('/admin/upload/xlsx')
  //@RequiredRoles(ROLES.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadXlsm() file: Express.Multer.File): Promise<any> {
    const { buffer, ...rest } = file;
    return rest;
  }
}
