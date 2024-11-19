import React, { FC, useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";

import { FilePlusIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast/use-toast";

const EXCEL_EXTENSIONS = [".xlsx", ".xls"];
const MAX_FILES = 2;

const FileUpload: FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => {
      const remainingSlots = MAX_FILES - prevFiles.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      return [...prevFiles, ...filesToAdd];
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    accept: {
      "application/vnd.ms-excel": EXCEL_EXTENSIONS,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        EXCEL_EXTENSIONS,
    },
    maxFiles: MAX_FILES,
    disabled: files.length >= MAX_FILES,
    noClick: files.length >= MAX_FILES,
    noDrag: files.length >= MAX_FILES,
  });
  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };
  const handleUploadClick = () => {
    // TODO: Adde API call when available
    setFiles([]);
    toast({ description: "Your files has been uploaded successfully." });
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        variant="secondary"
        className={cn({
          "select-none border-dashed p-10 transition-colors": true,
          "bg-card": isDragActive,
          "cursor-pointer hover:bg-card": files.length < MAX_FILES,
          "cursor-not-allowed opacity-50": files.length >= MAX_FILES,
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <FilePlusIcon className="h-5 w-5" />
          <p className="text-sm">
            {files.length < MAX_FILES
              ? "Drop files, or click to upload"
              : "Max amount of files exceeded"}
          </p>
        </div>
      </Card>
      {files.length > 0 && (
        <div className="space-y-4">
          <ol className="space-y-2">
            {files.map((file: File) => (
              <li key={file.name}>
                <Card className="flex items-center justify-between">
                  <p>
                    {file.name} - {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeFile(file)}
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                </Card>
              </li>
            ))}
          </ol>
          <div className="flex justify-end">
            <Button type="button" onClick={handleUploadClick}>
              Upload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
