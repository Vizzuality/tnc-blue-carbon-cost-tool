import React from 'react';
import { ThemeProvider } from 'styled-components';
import {
  theme,
  Box,
  Header,
} from '@adminjs/design-system';
import { ActionHeader, BreadcrumbLink, Breadcrumbs } from 'adminjs';

function FileIngestion() {
  return (
    <ThemeProvider theme={theme}>
      <Box variant="grey">
        <Header.H2>File Ingestion</Header.H2>
      </Box>
    </ThemeProvider>
  );
}

export default FileIngestion;
