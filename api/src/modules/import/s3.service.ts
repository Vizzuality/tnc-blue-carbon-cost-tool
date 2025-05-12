import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  S3ClientConfig,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { ApiConfigService } from '@api/modules/config/app-config.service';
import { UploadDataFilesDto } from '@shared/dtos/users/upload-data-files.dto';
import { S3Utils } from '@api/modules/import/utils/s3.utils';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger: Logger = new Logger(this.constructor.name);
  private readonly s3Config: S3ClientConfig;
  private readonly bucketName: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ApiConfigService) {
    this.s3Config = this.configService.getS3Config();
    this.s3Client = new S3Client(this.s3Config);
    this.bucketName = this.configService.getS3BucketName();
  }

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') return;

    try {
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.bucketName }),
      );
      this.logger.log(`Bucket "${this.bucketName}" already exists`);
    } catch (err: any) {
      if (err?.$metadata?.httpStatusCode === 404 || err?.name === 'NotFound') {
        this.logger.log(`Creating bucket "${this.bucketName}"...`);
        try {
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: this.bucketName }),
          );
        } catch (err) {}
        this.logger.log(`Bucket "${this.bucketName}" created`);
      } else if (err.name === 'BucketAlreadyOwnedByYou') {
        // Ignored
      } else {
        this.logger.error('Failed to check/create bucket:', err);
        throw err;
      }
    }
  }

  public generateS3Key(date: Date, userId: string, fileName: string): string {
    return S3Utils.generateS3Key(date, userId, fileName);
  }

  public async uploadUserFiles(files: UploadDataFilesDto): Promise<any> {
    const uploadPromises = files.map((file) => {
      return this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: file.key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    });
    return Promise.all(uploadPromises);
  }

  public async listFiles(): Promise<any> {
    const list = await this.s3Client.send(
      new ListObjectsV2Command({ Bucket: this.bucketName }),
    );
    list.Contents.forEach((obj) => this.logger.debug(`S3 file: ${obj.Key}`));

    return list.Contents;
  }

  public async downloadFileByKey(s3Key: string): Promise<any> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });
      const res = await this.s3Client.send(command);
      return res.Body;
    } catch (e) {
      this.logger.error('Error downloading file:', s3Key, e);
      return undefined;
    }
  }

  public async deleteFilesByKeys(s3Keys: string[]): Promise<void> {
    try {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: this.bucketName,
        Delete: {
          Objects: s3Keys.map((key) => ({ Key: key })),
        },
      });
      await this.s3Client.send(deleteCommand);
    } catch (e) {
      this.logger.error('Error deleting files:', s3Keys, e);
      throw new InternalServerErrorException('Error deleting files from S3');
    }
  }
}
