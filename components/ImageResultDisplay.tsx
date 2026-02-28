"use client";

import { Download, RotateCcw } from "lucide-react";

interface ImageResultDisplayProps {
  imageUrl: string;
  onReset: () => void;
}

export function ImageResultDisplay({ imageUrl, onReset }: ImageResultDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          下载
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          重置
        </button>
      </div>

      <div className="rounded-lg overflow-hidden bg-muted p-2">
        <img src={imageUrl} alt="生成的图片" className="max-w-full h-auto mx-auto" />
      </div>
    </div>
  );
}
