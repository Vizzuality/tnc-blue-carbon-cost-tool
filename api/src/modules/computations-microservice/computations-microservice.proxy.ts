import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';

@Injectable()
export class ComputationsMicroserviceProxy {
  private readonly logger = new Logger(ComputationsMicroserviceProxy.name);

  constructor(private readonly httpService: HttpService) {}

  async compute(dto: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<any>('/compute', dto),
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      this.logger.error(
        `Failed to call /compute: ${axiosError.message}`,
        axiosError.stack,
      );

      throw new InternalServerErrorException(
        'Error calling computation microservice',
      );
    }
  }
}
