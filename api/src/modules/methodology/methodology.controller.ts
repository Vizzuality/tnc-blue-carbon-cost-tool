import { MethodologyService } from '@api/modules/methodology/methodology.service';
import { ControllerResponse } from '@api/types/controller-response.type';
import { Controller, HttpStatus } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { methodologyContract } from '@shared/contracts/methodology.contract';
import { ChangelogService } from '@api/modules/methodology/changelog.service';

@Controller()
export class MethodologyController {
  constructor(
    private readonly methodologyService: MethodologyService,
    private readonly changelogService: ChangelogService,
  ) {}

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

  @TsRestHandler(methodologyContract.getChangeLogs)
  public async getChangeLogs(): ControllerResponse {
    return tsRestHandler(
      methodologyContract.getChangeLogs,
      async ({ query }) => {
        const result = await this.changelogService.findAllPaginated(query);

        // Transform DataIngestionEntity to Changelog type (excluding filePath)
        const transformedData = result.data.map((item) => ({
          createdAt: item.createdAt,
          versionName: item.versionName,
          versionNotes: item.versionNotes,
        }));

        return {
          body: {
            data: transformedData,
            metadata: result.metadata,
          },
          status: HttpStatus.OK,
        };
      },
    );
  }
}
