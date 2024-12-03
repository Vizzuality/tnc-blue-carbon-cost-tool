import React, { FC, useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";

import { FileUpIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/query-client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast/use-toast";

// Array should be in this order
export const EXCEL_FILES = [
  {
    name: "carbon-input-template.xlsx",
    path: "/forms/carbon-input-template.xlsx",
  },
  {
    name: "cost-input-template.xlsx",
    path: "/forms/cost-input-template.xlsx",
  },
];

const REQUIRED_FILE_NAMES = EXCEL_FILES.map((f) => f.name);
const EXCEL_EXTENSIONS = [".xlsx", ".xls"];
const MAX_FILES = 2;

const FileUpload: FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { data: session } = useSession();
  const { toast } = useToast();
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) =>
        REQUIRED_FILE_NAMES.includes(file.name),
      );

      if (validFiles.length !== acceptedFiles.length) {
        return toast({
          variant: "destructive",
          description:
            "Only carbon-input-template.xlsx and cost-input-template.xlsx files are allowed",
        });
      }

      setFiles((prevFiles) => {
        const remainingSlots = MAX_FILES - prevFiles.length;
        const filesToAdd = acceptedFiles.slice(0, remainingSlots);
        return [...prevFiles, ...filesToAdd];
      });
    },
    [toast],
  );

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
  const handleUploadClick = async () => {
    const fileNames = files.map((file) => file.name);
    const missingFiles = REQUIRED_FILE_NAMES.filter(
      (name) => !fileNames.includes(name),
    );

    if (missingFiles.length > 0) {
      return toast({
        variant: "destructive",
        description: `Missing required file${missingFiles.length > 1 ? "s" : ""}: ${missingFiles.join(", ")}`,
      });
    }

    const formData = new FormData();
    const sortedFiles = REQUIRED_FILE_NAMES.map(
      (name) => files.find((file) => file.name === name)!,
    );

    sortedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await client.user.uploadData.mutation({
        body: formData,
        extraHeaders: {
          authorization: `Bearer ${session?.accessToken as string}`,
        },
      });

      if (response.status === 201) {
        toast({ description: "Your files has been uploaded successfully." });
        setFiles([]);
      } else {
        toast({
          variant: "destructive",
          description:
            response.body.errors?.[0].title ||
            "Something went wrong uploading your files",
        });
      }
    } catch (e) {
      toast({
        variant: "destructive",
        description: "Something went wrong uploading your files",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        variant="secondary"
        className={cn({
          "select-none border bg-big-stone-950 p-10 transition-colors": true,
          "bg-card": isDragActive,
          "cursor-pointer hover:bg-card": files.length < MAX_FILES,
          "cursor-not-allowed opacity-50": files.length >= MAX_FILES,
        })}
      >
        <input id="share-information-input" {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <FileUpIcon className="h-5 w-5" strokeWidth={1} />
          <p className="text-sm">
            {files.length < MAX_FILES ? (
              <>
                Drag and drop the files or&nbsp;
                <span className="text-primary">click</span> to upload
              </>
            ) : (
              "You've attached the maximum of 2 files"
            )}
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
