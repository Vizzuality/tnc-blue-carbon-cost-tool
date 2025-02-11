import { MethodologyService } from '@api/modules/methodology/methodology.service';
import { ControllerResponse } from '@api/types/controller-response.type';
import { Controller, HttpStatus } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { methodologyContract } from '@shared/contracts/methodology.contract';

@Controller()
export class MethodologyController {
  constructor(private readonly methodologyService: MethodologyService) {}

  @TsRestHandler(methodologyContract.getMethodologySources)
  public async getActivityTypeDefaults(): Promise<ControllerResponse> {
    return tsRestHandler(
      methodologyContract.getMethodologySources,
      async () => {
        const data = await this.methodologyService.getModelComponentSources();
        return {
          body: { data: data },
          status: HttpStatus.OK,
        };
      },
    );
  }
}
