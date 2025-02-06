import { MethodologySourcesService } from '@api/modules/methodology/methodology-sources.service';
import { ControllerResponse } from '@api/types/controller-response.type';
import { Controller, HttpStatus } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { methodologyContract } from '@shared/contracts/methodology.contract';

@Controller()
export class MethodologyController {
  constructor(
    private readonly methodologySourcesService: MethodologySourcesService,
  ) {}

  @TsRestHandler(methodologyContract.getMethodologySources)
  public async getActivityTypeDefaults(): Promise<ControllerResponse> {
    return tsRestHandler(
      methodologyContract.getMethodologySources,
      async () => {
        const data =
          await this.methodologySourcesService.getModelComponentSources();
        return {
          body: { data: data },
          status: HttpStatus.OK,
        };
      },
    );
  }
}
