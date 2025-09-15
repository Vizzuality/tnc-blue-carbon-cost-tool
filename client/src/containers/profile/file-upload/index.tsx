import React, { FC, useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";

import Link from "next/link";

import {
  ALLOWED_USER_UPLOAD_FILE_EXTENSIONS,
  MAX_USER_UPLOAD_FILES,
} from "@shared/dtos/users/upload-data-files.constants";
import { FileUpIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import { TERMS_AND_CONDITIONS_URL } from "@/lib/constants";
import { client } from "@/lib/query-client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast/use-toast";

const MAX_FILES = MAX_USER_UPLOAD_FILES;
const getUniqueFileName = (fileName: string, existingFiles: File[]): string => {
  const baseName = fileName.substring(0, fileName.lastIndexOf("."));
  const extension = fileName.substring(fileName.lastIndexOf("."));
  let newName = fileName;
  let counter = 1;

  while (existingFiles.some((f) => f.name === newName)) {
    newName = `${baseName} (${counter})${extension}`;
    counter++;
  }

  return newName;
};

const FileUpload: FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => {
      const remainingSlots = MAX_FILES - prevFiles.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots).map((file) => {
        const newFileName = getUniqueFileName(file.name, prevFiles);
        if (newFileName !== file.name) {
          return new File([file], newFileName, { type: file.type });
        }
        return file;
      });
      return [...prevFiles, ...filesToAdd];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    accept: Object.entries(ALLOWED_USER_UPLOAD_FILE_EXTENSIONS).reduce(
      (acc, [ext, mime]) => ({ ...acc, [mime]: [ext] }),
      {},
    ),
    maxFiles: MAX_FILES,
    disabled: files.length >= MAX_FILES,
    noClick: files.length >= MAX_FILES,
    noDrag: files.length >= MAX_FILES,
  });

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleUploadClick = async () => {
    setIsUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
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
    } finally {
      setIsUploading(false);
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
        <input id="share-data-input" {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <FileUpIcon className="h-5 w-5" strokeWidth={1} />
          {files.length < MAX_FILES ? (
            <>
              <p className="text-sm">
                Drag and drop your files (
                {Object.keys(ALLOWED_USER_UPLOAD_FILE_EXTENSIONS).join(", ")})
                here, or&nbsp;
                <span className="text-primary">click</span> to upload
              </p>
              <p className="text-sm">Maximum of {MAX_FILES} files allowed.</p>
            </>
          ) : (
            <p className="text-sm">
              You&apos;ve attached the maximum of {MAX_FILES} files
            </p>
          )}
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
            <Button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
      <p className="text-center text-sm text-muted-foreground">
        By sharing your data with us, you consent to being contacted for future
        follow-ups. For more details, please review our&nbsp;
        <Button
          variant="link"
          className="h-auto p-0 text-sm text-muted-foreground underline underline-offset-auto"
          asChild
        >
          <Link href={TERMS_AND_CONDITIONS_URL} target="_blank">
            Terms and Conditions
          </Link>
        </Button>
        .
      </p>
    </div>
  );
};

export default FileUpload;
