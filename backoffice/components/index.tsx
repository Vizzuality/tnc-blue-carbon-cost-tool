import { ComponentLoader } from 'adminjs';

export const componentLoader = new ComponentLoader();

export const Components = {
  Dashboard: componentLoader.add('Dashboard', './dashboard'),
  FileIngestion: componentLoader.add(
    'FileIngestion',
    './pages/file-ingestion/page',
  ),
  Many2ManySources: componentLoader.add(
    'Many2ManySources',
    './molecules/many-2-many-sources',
  ),
  CountrySelector: componentLoader.add(
    'CountrySelector',
    './atoms/country-selector.tsx',
  ),
  DownloadUserFiles: componentLoader.add(
    'DownloadUserFiles',
    './molecules/download-user-files',
  ),
  ProjectDynamicForm: componentLoader.add(
    'ProjectDynamicForm',
    './organisms/project-dynamic-form',
  ),
};
