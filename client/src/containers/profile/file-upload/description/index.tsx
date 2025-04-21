import { FC } from "react";

import { UploadDataTemplateDto } from "@shared/dtos/users/upload-data-files.dto";
import { FileDownIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getAuthHeader } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const getDownloadUrl = (file: UploadDataTemplateDto) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/users/upload-data/templates/${file.id}`;
};
const downloadFiles = (files?: UploadDataTemplateDto[]) => {
  if (!files) return;

  files.forEach((f) => {
    const link = document.createElement("a");
    link.href = getDownloadUrl(f);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
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
      select: (data) => data.body.data,
    },
  );

  return (
    <>
      <p>
        Provide your input on the methodology and data by&nbsp;
        <Button
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={() => downloadFiles(data)}
        >
          downloading
        </Button>
        &nbsp;the required templates, completing them with the necessary
        information, and&nbsp;
        <Button
          variant="link"
          className="h-auto p-0 text-primary"
          onClick={openFileUploadWindow}
        >
          uploading
        </Button>
        &nbsp;them to contribute new insights for evaluation.
      </p>

      {data && (
        <ol className="flex gap-4">
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
