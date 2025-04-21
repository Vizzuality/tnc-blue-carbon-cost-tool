import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
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
import { Response } from 'express';
import { GetUser } from '@api/modules/auth/decorators/get-user.decorator';
import { User } from '@shared/entities/users/user.entity';
import { usersContract } from '@shared/contracts/users.contract';
import {
  ALLOWED_USER_UPLOAD_FILE_EXTENSIONS,
  AVAILABLE_USER_UPLOAD_TEMPLATES,
} from '@shared/dtos/users/upload-data-files.constants';
import { JwtCookieAuthGuard } from '@api/modules/auth/guards/jwt-cookie-auth.guard';
import { extname, join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Multer } from 'multer';

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

  @UseInterceptors(AnyFilesInterceptor({ limits: { files: 3, fields: 0 } }))
  @RequiredRoles(ROLES.PARTNER, ROLES.ADMIN)
  @TsRestHandler(usersContract.uploadData)
  async uploadData(
    @GetUser() user: User,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<ControllerResponse> {
    return tsRestHandler(usersContract.uploadData, async () => {
      if (!Array.isArray(files) || files.length === 0) {
        throw new BadRequestException('No files provided');
      }

      for (const file of files) {
        const ext = extname(file.originalname).toLowerCase();
        const allowedExtensions = Object.keys(
          ALLOWED_USER_UPLOAD_FILE_EXTENSIONS,
        );
        if (allowedExtensions.includes(ext) === false) {
          throw new BadRequestException(
            `Invalid file type: ${ext}. Only ${allowedExtensions.join(
              ',',
            )} are allowed.`,
          );
        }
      }

      const userUpload = await this.service.importDataProvidedByPartner(
        files,
        user.id,
      );
      return { body: { data: userUpload }, status: HttpStatus.CREATED };
    });
  }

  @TsRestHandler(usersContract.listUploadDataTemplates)
  @RequiredRoles(ROLES.PARTNER, ROLES.ADMIN)
  public async downloadUserUploadTemplates(): Promise<ControllerResponse> {
    return tsRestHandler(usersContract.listUploadDataTemplates, async () => {
      return {
        status: 200,
        body: { data: AVAILABLE_USER_UPLOAD_TEMPLATES },
      };
    });
  }

  @TsRestHandler(usersContract.deleteUploadedData)
  @RequiredRoles(ROLES.ADMIN)
  public async deleteUploadedData(
    @Param('id') id: number,
  ): Promise<ControllerResponse> {
    return tsRestHandler(usersContract.deleteUploadedData, async () => {
      await this.service.deleteUserUpload(id);
      return {
        status: 204,
        body: null,
      };
    });
  }

  @Get('/users/upload-data/templates/:templateId')
  @RequiredRoles(ROLES.PARTNER, ROLES.ADMIN)
  public async downloadUserUploadTemplate(
    @GetUser() user: User,
    @Param('templateId') templateId: string,
    @Res() res: Response,
  ): Promise<ControllerResponse> {
    const foundTemplate = AVAILABLE_USER_UPLOAD_TEMPLATES.find(
      (t) => t.id === templateId,
    );
    if (!foundTemplate) throw new NotFoundException('Template not found');

    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'files',
      foundTemplate.fileName,
    );
    return res.download(filePath);
  }

  @Get('/users/upload-data/submissions/:userUploadId/:fileId')
  @RequiredRoles(ROLES.ADMIN)
  public async downloadUserUploadSubmission(
    @Param('userUploadId') userUploadId: number,
    @Param('fileId') fileId: number,
    @Res() res: Response,
  ): Promise<any> {
    const [userUploadFile, stream] = await this.service.downloadUserUploadFile(
      userUploadId,
      fileId,
    );

    res.set({
      'Content-Type': userUploadFile.mimeType,
      'Content-Disposition': `attachment; filename="${userUploadFile.originalName}"`,
    });

    stream.pipe(res);
  }
}
