import {
  BadRequestException,
  Controller,
  HttpStatus,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
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
import {
  UPLOAD_DATA_FILE_KEYS,
  UploadDataFilesDto,
} from '@shared/dtos/users/upload-data-files.dto';

@Controller()
@UseGuards(JwtCookieAuthGuard, RolesGuard)
export class ImportController {
  constructor(private readonly service: ImportService) {}
  // TODO: File validation following:
  //       https://docs.nestjs.com/techniques/file-upload

  @TsRestHandler(adminContract.uploadFile)
  @UseInterceptors(FileInterceptor('file'))
  @RequiredRoles(ROLES.ADMIN)
  async uploadFile(
    @UploadXlsm() file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<ControllerResponse> {
    return tsRestHandler(adminContract.uploadFile, async () => {
      await this.service.import(file.buffer, user.id);
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

  @UseInterceptors(AnyFilesInterceptor({ limits: { files: 2, fields: 0 } }))
  @RequiredRoles(ROLES.PARTNER, ROLES.ADMIN)
  @TsRestHandler(usersContract.uploadData)
  async uploadData(
    @GetUser() user: User,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    return tsRestHandler(usersContract.uploadData, async () => {
      const uploadedFiles: UploadDataFilesDto = files.reduce((acc, file) => {
        acc[file.fieldname] = file;
        return acc;
      }, {});
      if (
        uploadedFiles[UPLOAD_DATA_FILE_KEYS.CARBON_INPUTS_TEMPLATE] == null ||
        uploadedFiles[UPLOAD_DATA_FILE_KEYS.COST_INPUTS_TEMPLATE] == null
      ) {
        throw new BadRequestException(
          'At least one of the files should be provided {carbon-inputs-template, cost-inputs-template}',
        );
      }
      const [errors, data] = await this.service.importDataProvidedByPartner(
        uploadedFiles,
        user.id,
      );
      if (errors) {
        return { body: { errors }, status: HttpStatus.BAD_REQUEST };
      }
      return { body: { data }, status: HttpStatus.CREATED };
    });
  }
}
