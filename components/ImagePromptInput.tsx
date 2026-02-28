"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";

interface ImagePromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function ImagePromptInput({
  onSubmit,
  isLoading,
}: ImagePromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        rows={4}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={"描述你想生成的图片..."}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:pointer-events-none disabled:opacity-50"
      >
        <Wand2 className="w-4 h-4" />
        {"生成图片"}
      </button>
    </form>
  );
}
