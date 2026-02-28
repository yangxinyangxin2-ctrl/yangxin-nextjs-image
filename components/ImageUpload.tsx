"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  referenceImage: string | null;
  canRemove?: boolean;
}

export function ImageUpload({
  onImageSelect,
  referenceImage,
  canRemove = false,
}: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelect(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleRemove = () => {
    onImageSelect("");
  };

  return (
    <div className="w-full space-y-4">
      {!referenceImage ? (
        <div
          {...getRootProps()}
          className={`min-h-[150px] rounded-2xl border-2 border-dashed cursor-pointer
          flex flex-col items-center justify-center gap-4 p-6
          ${
            isDragActive
              ? "border-primary/50 bg-primary/5"
              : "border-secondary bg-secondary/70 hover:border-primary/50 hover:bg-primary/5"
          } transition-colors`}
        >
          <input {...getInputProps()} />
          <UploadIcon className="w-10 h-10 text-primary" />
          <p className="text-sm text-foreground">拖拽图片或点击上传</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-secondary bg-secondary/70 p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-foreground">已选择图片</p>
            {canRemove && (
              <button
                onClick={handleRemove}
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <img
            src={referenceImage}
            alt="已选择的图片"
            className="w-full h-auto rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}
