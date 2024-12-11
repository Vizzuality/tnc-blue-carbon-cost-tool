import React, { useState } from 'react';
import { Box, H2, Text, Button, Tabs, Tab, DropZone, Icon } from '@adminjs/design-system';

const FileIngestion = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [fileOne, setFileOne] = useState<File | null>(null);
  const [fileTwo, setFileTwo] = useState<File | null>(null);

  const handleFileUpload = (tab: string, file: File) => {
    if (tab === 'first') {
      setFileOne(file);
    } else if (tab === 'second') {
      setFileTwo(file);
    }
  };

  const handleSubmit = async (tab: string) => {
    const file = tab === 'first' ? fileOne : fileTwo;
    if (!file) {
      alert('Please upload a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // /admin is not exposed when the app runs behind a reverse proxy
      const response = await fetch('http://localhost:4000/admin/upload/xlsx', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Backoffice cookie will be sent
      });
      const result = await response.json();
      alert(`File uploaded successfully: ${JSON.stringify(result)}`);
    } catch (error) {
      alert(`Error uploading file: ${error.message}`);
    }
  };

  return (
    <Box variant="grey">
      <Box variant="white">
        <H2>File Ingestion</H2>
        <Text>Use this page to update the available data</Text>
      </Box>
      <Box
        mt="xxl"
        display="flex"
        flexDirection="column"
        variant="white"
      >
        <Tabs currentTab={activeTab} onChange={(index) => setActiveTab(index)}>
          <Tab id='first' label="Data ingestion WIP">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p="xl">
              <Box width="100%" maxWidth="400px">
                <DropZone 
                  onChange={(files) => handleFileUpload('first', files[0])}
                  multiple={false}
                />
              </Box>
              {fileOne && <Text mt="md">File selected: {fileOne.name}</Text>}
              <Box display="flex" justifyContent="flex-end" width="100%" mt="lg">
                <Button onClick={() => handleSubmit('first')}><Icon icon="Upload"/>Upload</Button>
              </Box>
            </Box>
          </Tab>
          <Tab id='second' label="Project Scorecards">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p="xl">
              <Box width="100%" maxWidth="400px">
                <DropZone
                  onChange={(files) => handleFileUpload('second', files[0])}
                  multiple={false}
                />
              </Box>
              {fileTwo && <Text mt="md">File selected: {fileTwo.name}</Text>}
              <Box display="flex" justifyContent="flex-end" width="100%" mt="lg">
                <Button onClick={() => handleSubmit('second')}><Icon icon="Upload"/>Upload</Button>
              </Box>
            </Box>
          </Tab>
        </Tabs>
      </Box>
    </Box>
  );
};

export default FileIngestion;
