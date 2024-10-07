import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@api/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';
import { RequiredRoles } from '@api/modules/auth/decorators/roles.decorator';
import { ROLES } from '@shared/entities/users/roles.enum';
import { UploadXlsm } from '@api/modules/import/decorators/xlsm-upload.decorator';
import { ImportService } from '@api/modules/import/import.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';

@Controller()
@UseInterceptors(JwtAuthGuard, RolesGuard)
export class ImportController {
  constructor(private readonly service: ImportService) {}
  // TODO: File validation following:
  //       https://docs.nestjs.com/techniques/file-upload

  @Post('/admin/upload/xlsx')
  @RequiredRoles(ROLES.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadXlsm() file: Express.Multer.File): Promise<any> {
    return this.service.import(file.buffer);
  }
}
