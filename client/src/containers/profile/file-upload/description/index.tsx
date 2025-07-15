import { FC } from "react";

import { AVAILABLE_USER_UPLOAD_TEMPLATES } from "@shared/dtos/users/upload-data-files.constants";
import { UploadDataTemplateDto } from "@shared/dtos/users/upload-data-files.dto";
import { FileDownIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const EXCLUSION_FILE_NAMES = [AVAILABLE_USER_UPLOAD_TEMPLATES[0].fileName];

const getDownloadUrl = (file: UploadDataTemplateDto) => {
  // This endpoint is not available in the ts-rest contract
  return `${process.env.NEXT_PUBLIC_API_URL}/users/upload-data/templates/${file.id}`;
};
const downloadFile = (f: UploadDataTemplateDto) => {
  const link = document.createElement("a");
  link.href = getDownloadUrl(f);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const openFileUploadWindow = () =>
  document.getElementById("share-information-input")?.click();
const queryKey = queryKeys.user.listUploadDataTemplates.queryKey;

const FileUploadDescription: FC = () => {
  const { data: session } = useSession();
  const { data } = client.user.listUploadDataTemplates.useQuery(
    queryKey,
    {
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
    },
    {
      queryKey,
      select: (data) =>
        data.body.data.filter(
          ({ fileName }) => !EXCLUSION_FILE_NAMES.includes(fileName),
        ),
    },
  );

  return (
    <>
      <p className="text-center">
        Provide your input on the methodology and data by&nbsp;
        <Button
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={openFileUploadWindow}
        >
          uploading
        </Button>
        &nbsp;files in accepted formats or by using the&nbsp;
        <Button
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={() => downloadFile(AVAILABLE_USER_UPLOAD_TEMPLATES[0])}
        >
          downloadable
        </Button>
        &nbsp;templates.
      </p>

      {data && (
        <ol className="flex justify-center gap-4">
          {data.map((f) => (
            <li key={`file-${f.fileName}`}>
              <Button variant="link" className="p-0" asChild>
                <a href={getDownloadUrl(f)}>
                  <FileDownIcon className="h-5 w-5" strokeWidth={1} />
                  <span>{f.fileName}</span>
                </a>
              </Button>
            </li>
          ))}
        </ol>
      )}
    </>
  );
};

export default FileUploadDescription;
