import { Controller, HttpStatus } from '@nestjs/common';
import { MethodologyService } from '@api/modules/methodology/methodology.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { methodologyContract } from '@shared/contracts/methodology.contract';

@Controller()
export class MethodologyController {
  constructor(private readonly methodologyService: MethodologyService) {}

  @TsRestHandler(methodologyContract.getAllModelAssumptions)
  async getAllModelAssumptions(): Promise<ControllerResponse> {
    return tsRestHandler(
      methodologyContract.getAllModelAssumptions,
      async () => {
        const data = await this.methodologyService.getAllModelAssumptions();
        return { body: { data }, status: HttpStatus.OK };
      },
    );
  }
}
