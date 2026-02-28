"use client";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImagePromptInput } from "@/components/ImagePromptInput";
import { ImageResultDisplay } from "@/components/ImageResultDisplay";
import { ImageIcon, Wand2 } from "lucide-react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePromptSubmit = async (prompt: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          image: generatedImage || image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "生成图片失败");
      }

      const data = await response.json();
      if (data.image) {
        setGeneratedImage(data.image);
      } else {
        setError("接口未返回图片");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "发生错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-black px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Wand2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            AI 图像生成
          </h1>
        </div>

        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-medium text-foreground mb-4">
              原始图片
            </h2>
            <div className="space-y-6">
              <ImageUpload
                onImageSelect={setImage}
                referenceImage={image}
                canRemove={!!image}
              />
              <ImagePromptInput
                onSubmit={handlePromptSubmit}
                isLoading={loading}
              />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-medium text-foreground mb-4">
              生成结果
            </h2>
            {loading ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
                <ImageIcon className="h-12 w-12 text-primary/60 animate-pulse" />
                <p className="text-sm text-muted-foreground">正在生成图像...</p>
              </div>
            ) : generatedImage ? (
              <ImageResultDisplay
                imageUrl={generatedImage}
                onReset={handleReset}
              />
            ) : (
              <div className="flex h-full flex-col justify-center items-center p-12 text-center">
                <ImageIcon className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <p className="text-sm text-muted-foreground">
                  上传图片或输入提示词开始创作
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
