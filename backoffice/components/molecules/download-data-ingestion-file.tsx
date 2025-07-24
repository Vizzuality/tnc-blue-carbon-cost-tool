import React, { useEffect, useState } from 'react';
import { BasePropertyProps } from 'adminjs';
import { Badge, Label, Link } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

export type DownloadDataIngestionFileProps = BasePropertyProps;

const DownloadDataIngestionFile: React.FC<DownloadDataIngestionFileProps> = ({
  record,
  where,
}) => {
  const isShowView = where === 'show';
  const [config, setConfig] = useState<{ apiUrl?: string }>({});
  const filePath = record?.params?.filePath;
  const createdAt = record?.params?.createdAt;

  useEffect(() => {
    api.getPage({ pageName: 'data-upload' }).then((res: any) => {
      setConfig(res.data.config);
    });
  }, []);

  // Extract filename from the S3 path
  const fileName = filePath ? filePath.split('/').pop() : 'data-ingestion-file';

  return (
    <>
      {isShowView === true && (
        <Label
          style={{
            textTransform: 'capitalize',
          }}
        >
          File
        </Label>
      )}
      {config && filePath && createdAt ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Badge>
            <Link
              href={`${config.apiUrl}/admin/data-ingestion/${encodeURIComponent(createdAt)}/download`}
              style={{ color: 'inherit' }}
              rel="noopener noreferrer"
            >
              {fileName}
            </Link>
          </Badge>
        </div>
      ) : filePath && !createdAt ? (
        <div style={{ marginBottom: '1rem' }}>
          <Badge variant="secondary">{fileName} (Download unavailable)</Badge>
        </div>
      ) : (
        <p>No file available</p>
      )}
    </>
  );
};

export default DownloadDataIngestionFile;
