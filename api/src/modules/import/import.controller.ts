import {
  Controller,
  HttpStatus,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
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
import { usersContract } from '@shared/contracts/users.contract';
import { JwtCookieAuthGuard } from '@api/modules/auth/guards/jwt-cookie-auth.guard';

@Controller()
@UseGuards(JwtCookieAuthGuard, RolesGuard)
export class ImportController {
  constructor(private readonly service: ImportService) {}
  // TODO: File validation following:
  //       https://docs.nestjs.com/techniques/file-upload

  @TsRestHandler(adminContract.uploadFile)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  @RequiredRoles(ROLES.ADMIN)
  async uploadFile(
    @UploadedFiles()
    files: { file?: Express.Multer.File[] },
    @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(adminContract.uploadFile, async () => {
      await this.service.import(files.file[0].buffer, user.id);
      return {
        status: 201,
        body: null,
      };
    });
  }

  @TsRestHandler(adminContract.uploadProjectScorecard)
  @UseInterceptors(FileInterceptor('file'))
  @RequiredRoles(ROLES.ADMIN)
  async uploadProjectScorecard(
    @UploadXlsm() file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(adminContract.uploadProjectScorecard, async () => {
      const importedData = await this.service.importProjectScorecard(
        file.buffer,
        user.id,
      );
      return {
        status: 201,
        body: importedData,
      };
    });
  }

  @UseInterceptors(FilesInterceptor('files', 2))
  @RequiredRoles(ROLES.PARTNER, ROLES.ADMIN)
  @TsRestHandler(usersContract.uploadData)
  async uploadData(
    @GetUser() user: User,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    return tsRestHandler(usersContract.uploadData, async () => {
      const [file1, file2] = files;
      const [file1Buffer, file2Buffer] = [file1.buffer, file2.buffer];
      const data = await this.service.importDataProvidedByPartner(
        [file1Buffer, file2Buffer],
        user.id,
      );
      return { body: data, status: HttpStatus.CREATED };
    });
  }
}
