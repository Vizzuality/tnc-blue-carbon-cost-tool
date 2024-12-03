import { FC } from "react";

import { FileDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const downloadFiles = (files: iFile[]) => {
  files.forEach((f) => {
    const link = document.createElement("a");
    link.href = f.path;
    link.download = f.path.split("/").pop() || "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

const openFileUploadWindow = () =>
  document.getElementById("share-information-input")?.click();

interface iFile {
  name: string;
  path: string;
}

interface FileUploadDescriptionProps {
  files: iFile[];
}

const FileUploadDescription: FC<FileUploadDescriptionProps> = ({ files }) => {
  return (
    <>
      <p>
        Provide your input on the methodology and data by&nbsp;
        <Button
          variant="link"
          className="p-0 text-primary"
          onClick={() => downloadFiles(files)}
        >
          downloading
        </Button>
        &nbsp;the required templates, completing them with the necessary
        information, and&nbsp;
        <Button
          variant="link"
          className="p-0 text-primary"
          onClick={openFileUploadWindow}
        >
          uploading
        </Button>
        &nbsp;them to contribute new insights for evaluation.
      </p>

      <ol className="flex gap-4">
        {files.map((f) => (
          <li key={`file-${f.name}`}>
            <Button variant="link" className="p-0" asChild>
              <a href={f.path}>
                <FileDownIcon className="h-5 w-5" strokeWidth={1} />
                <span>{f.name}</span>
              </a>
            </Button>
          </li>
        ))}
      </ol>
    </>
  );
};

export default FileUploadDescription;
