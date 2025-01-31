import { ComponentLoader } from 'adminjs';

export const componentLoader = new ComponentLoader();

export const Components = {
  Dashboard: componentLoader.add('Dashboard', './dashboard'),
  FileIngestion: componentLoader.add(
    'FileIngestion',
    './pages/file-ingestion/page',
  ),
  Calculator: componentLoader.add('Calculator', './molecules/calculator'),
  EmissionFactorSources: componentLoader.add(
    'EmissionFactorSources',
    './molecules/emission-factors-sources',
  ),
};
