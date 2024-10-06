import { UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';

export function UploadXlsm(maxSize: number = 5000000) {
  return UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'application/vnd.ms-excel.sheet.macroenabled.12',
      })
      .addMaxSizeValidator({
        maxSize: maxSize,
      })
      .build({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        fileIsRequired: true,
      }),
  );
}
