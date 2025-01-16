import React, { useLayoutEffect, useState } from 'react';
import {
  Box,
  H2,
  Text,
  Button,
  Tabs,
  Tab,
  DropZone,
  H4,
} from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import styled from 'styled-components';

const CustomAlert = ({ title, message, onClose }) => {
  const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    background: rgba(255, 255, 255, 0.7);
    z-index: 999;
  `;

  const AlertBox = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid #ccc;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    text-align: left;
    overflow: auto;
  `;

  return (
    <>
      <Overlay>
        <AlertBox>
          <H4>{title}</H4>
          <Text>{message}</Text>
          <Button mt="xl" onClick={onClose}>
            OK
          </Button>
        </AlertBox>
      </Overlay>
    </>
  );
};

const UploadTab = ({
  props: { id, label, file, handleFileUpload, handleSubmit },
}) => {
  return (
    <Tab id={id} label={label}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p="xl"
      >
        <Box width="100%" maxWidth="400px">
          <DropZone
            onChange={(files) => handleFileUpload(id, files[0])}
            multiple={false}
          />
        </Box>
        {file && <Text mt="md">File selected: {file.name}</Text>}
        <Box display="flex" justifyContent="center" width="100%" mt="lg">
          <Button onClick={() => handleSubmit(id)}>Send</Button>
        </Box>
      </Box>
    </Tab>
  );
};

const FileIngestion = () => {
  // Component state
  const [activeTab, setActiveTab] = useState<'scorecard' | 'data'>('scorecard');
  const [scoreCardFile, setScoreCardFile] = useState<File | null>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [alertData, setAlertData] = useState<{
    title: string;
    message?: string;
    messages?: string[];
  } | null>();

  // Weird Adminjs setup
  const adminjsClient = new ApiClient();
  const [config, setConfig] = useState<{ apiUrl: string } | null>(null);

  useLayoutEffect(() => {
    adminjsClient
      .getPage({ pageName: 'fileIngestion' })
      .then((response: any) => {
        setConfig(response.data.config);
      });
  }, []);

  const handleFileUpload = (tab: string, file: File) => {
    if (tab === 'scorecard') {
      setScoreCardFile(file);
    } else if (tab === 'data') {
      setDataFile(file);
    }
  };

  const handleSubmit = async (tab: string) => {
    let endPoint = config!.apiUrl;
    let file;

    if (tab === 'scorecard') {
      endPoint += '/admin/upload/scorecard';
      file = scoreCardFile;
    } else if (tab === 'data') {
      endPoint += '/admin/upload/xlsx';
      file = dataFile;
    }

    if (!file) {
      alert(`Please upload the ${tab} file first!`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // /admin is not exposed when the app runs behind a reverse proxy
      const response = await fetch(endPoint, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (response.status === 201) {
        setAlertData({
          title: '✅ Done',
          message: 'The file was successfully uploaded.',
        });
      } else if (response.status === 409) {
        const body = await response.json();
        const errorMsgs = body.errors.map((error: { title: string }) => {
          return error.title;
        });
        setAlertData({ title: `❌ Error`, message: errorMsgs });
      } else {
        setAlertData({
          title: '❌ Error',
          message: 'An error occurred while uploading the file.',
        });
      }
    } catch (error) {
      setAlertData({ title: '❌ Error', message: error.message });
    }
  };

  return (
    <Box variant="grey">
      <Box variant="white">
        <H2>File Ingestion</H2>
        <Text>
          Use this page to update the available data. You must upload both files
          in the correct order:
        </Text>
        <Text>
          1. Upload the scorecard file first - this is required each time you
          want to upload new data
        </Text>
        <Text>
          2. Upload the data file - this will replace any existing data
        </Text>
      </Box>
      <Box mt="xxl" display="flex" flexDirection="column" variant="white">
        <Tabs
          currentTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as 'scorecard' | 'data')}
        >
          <UploadTab
            props={{
              id: 'scorecard',
              label: 'Project Scorecards',
              file: scoreCardFile,
              handleFileUpload,
              handleSubmit,
            }}
          />
          <UploadTab
            props={{
              id: 'data',
              label: 'Data ingestion WIP',
              file: dataFile,
              handleFileUpload,
              handleSubmit,
            }}
          />
        </Tabs>
      </Box>
      {alertData && (
        <CustomAlert
          title={alertData.title}
          message={alertData.message}
          onClose={() => {
            setAlertData(null);
          }}
        />
      )}
    </Box>
  );
};

export default FileIngestion;
