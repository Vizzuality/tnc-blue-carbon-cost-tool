import { Injectable } from '@nestjs/common';
import { ACTIVITY } from '@shared/entities/activity.enum';
import { ConservationProject } from '@api/modules/custom-projects/conservation.project';
import { ProjectConfig } from '@api/modules/custom-projects/project-config.interface';

@Injectable()
export class CustomProjectFactory {
  createProject(projectConfig: ProjectConfig) {
    if (projectConfig.activity === ACTIVITY.CONSERVATION) {
      return new ConservationProject(projectConfig);
    } else if (projectConfig.activity === ACTIVITY.RESTORATION) {
      // Instanciaremos RestorationProject una vez esté implementado
      //return new RestorationProject(projectConfig, baseData);
    } else {
      throw new Error('Invalid activity type');
    }
  }
}
