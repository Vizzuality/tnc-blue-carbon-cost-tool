import React, { useEffect, useState } from 'react';
import { Box, H2, Text, Button, Tabs, Tab, DropZone, Icon } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const UploadTab = ({props: { id, label, file, handleFileUpload, handleSubmit }}) => {
  return (
    <Tab id={id} label={label}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p="xl">
        <Box width="100%" maxWidth="400px">
          <DropZone 
            onChange={(files) => handleFileUpload(id, files[0])}
            multiple={false}
          />
        </Box>
        {file && <Text mt="md">File selected: {file.name}</Text>}
        <Box display="flex" justifyContent="flex-end" width="100%" mt="lg">
          <Button onClick={() => handleSubmit(id)}><Icon icon="Upload"/>Upload</Button>
        </Box>
      </Box>
    </Tab>
  );
}

const FileIngestion = () => {
  // Component state
  const [activeTab, setActiveTab] = useState('first');
  const [fileOne, setFileOne] = useState<File | null>(null);
  const [fileTwo, setFileTwo] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Weird Adminjs setup
  const adminjsClient = new ApiClient();
  const [config, setConfig] = useState<{ apiUrl: string } | null>(null);
  
  adminjsClient.getPage({ pageName: 'fileIngestion' }).then((response: any) => {
    setConfig(response.data.config);
  });

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
      const response = await fetch(`${config!.apiUrl}/admin/upload/xlsx`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if(response.status === 201) {
        alert('The file was successfully uploaded and processed.');
      } else {
        alert('An error occurred while uploading the file.');
      }
    } catch (error) {
      alert(`An error occurred while uploading the file: ${error.message}`);
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
          <UploadTab
            props={{
             id: 'first',
             label: "Data ingestion WIP",
             file: fileOne,
             handleFileUpload,
             handleSubmit
            }}
          />
          <UploadTab
            props={{
             id: 'second',
             label: "Project Scorecards",
             file: fileTwo,
             handleFileUpload,
             handleSubmit
            }}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default FileIngestion;
