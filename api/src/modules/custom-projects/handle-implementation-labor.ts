import { CreateCustomProjectDto } from '@shared/dtos/custom-projects/create-custom-project.dto';
import { ACTIVITY } from '@shared/entities/activity.enum';

/**
 * @description: Temporal workaround to set implementation labor to 0 when project type is Conservation. This is a temporal solution for a tracked bug
 *               when implementation labor is taken into account for Conservation projects.
 */

export const handleImplementationLabor = (dto: CreateCustomProjectDto) => {
  if (dto.activity === ACTIVITY.CONSERVATION) {
    dto.costInputs.implementationLabor = 0;
  }
  return dto;
};
