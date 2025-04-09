import React, { useEffect, useState } from 'react';
import { BasePropertyProps } from 'adminjs';
import {
  ComputeFetchParamsFuncType,
  ComputeAddParamsFuncType,
  ComputeDeleteParamsFuncType,
} from 'backoffice/components/molecules/many-2-many-sources.js';
import { Badge, Label, Link } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

export type DownloadUserFilesProps = BasePropertyProps & {
  computeFetchParams?: ComputeFetchParamsFuncType;
  computeAddParams?: ComputeAddParamsFuncType;
  computeDeleteParams?: ComputeDeleteParamsFuncType;
};

const DownloadUserFiles: React.FC<DownloadUserFilesProps> = ({
  record,
  where,
}) => {
  const isShowView = where === 'show';
  const [config, setConfig] = useState<{ apiUrl?: string }>({});
  const [files, setFiles] = useState<Record<string, any>[]>([]);
  const [recordId, setRecordId] = useState<string | undefined>(record?.id);

  useEffect(() => {
    api.getPage({ pageName: 'data-upload' }).then((res: any) => {
      setConfig(res.data.config);
    });
  });

  useEffect(() => {
    const params = record?.params || {};
    const reconstructedFiles: any[] = [];

    Object.entries(params).forEach(([key, value]) => {
      const match = key.match(/^files\.(\d+)\.(.+)$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const prop = match[2];

        if (!reconstructedFiles[index]) {
          reconstructedFiles[index] = {};
        }
        reconstructedFiles[index][prop] = value;
      }
    });

    setFiles(reconstructedFiles);
  }, [record?.params]);

  return (
    <>
      {isShowView === true && (
        <Label
          style={{
            textTransform: 'capitalize',
          }}
        >
          Files
        </Label>
      )}
      {config && Array.isArray(files) && files.length > 0 ? (
        files.map((file) => (
          <div key={file.id} style={{ marginBottom: '1rem' }}>
            <Badge>
              <Link
                href={`${config.apiUrl}/users/upload-data/submissions/${recordId}/${file.id}`}
                style={{ color: 'inherit' }}
              >
                {file.originalName ?? `File ${file.id}`}
              </Link>
            </Badge>
          </div>
        ))
      ) : (
        <p>No files found</p>
      )}
    </>
  );
};

export default DownloadUserFiles;
