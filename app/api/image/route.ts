import { NextRequest, NextResponse } from "next/server";

// API 配置
const ARK_API_KEY = process.env.API_KEY || "";
const ARK_API_URL =
  process.env.BASE_URL || "";
const MODEL_ID = process.env.MODEL || "";

// API 请求体类型
interface ArkApiRequest {
  model: string;
  prompt: string;
  image?: string;
  size: string;
  sequential_image_generation: string;
  stream: boolean;
  response_format: string;
  watermark: boolean;
}

export async function POST(req: NextRequest) {
  try {
    // 检查 API Key 是否配置
    if (!ARK_API_KEY) {
      console.error("未配置 API_KEY");
      return NextResponse.json(
        { success: false, error: "未配置 API_KEY，请在环境变量中补充密钥" },
        { status: 500 }
      );
    }

    // 检查 MODEL 是否配置
    if (!MODEL_ID) {
      console.error("未配置 MODEL");
      return NextResponse.json(
        { success: false, error: "未配置 MODEL，请在环境变量中设置模型名称" },
        { status: 500 }
      );
    }

    // 解析 JSON 请求
    const requestData = await req.json().catch((err) => {
      console.error("解析 JSON 请求体失败：", err);
      return null;
    });

    if (!requestData) {
      return NextResponse.json(
        { success: false, error: "请求体 JSON 不合法" },
        { status: 400 }
      );
    }

    const { prompt, image: inputImage } = requestData;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "请填写提示词" },
        { status: 400 }
      );
    }

    // 准备 API 请求体
    const requestBody: ArkApiRequest = {
      model: MODEL_ID,
      prompt: prompt,
      size: "2K",
      sequential_image_generation: "disabled",
      stream: false,
      response_format: "url",
      watermark: true,
    };

    // 如果提供了图片，添加到请求中
    // API 支持 data URL 格式
    if (inputImage) {
      // 验证图片格式
      if (typeof inputImage !== "string") {
        return NextResponse.json(
          { success: false, error: "图片内容格式不正确" },
          { status: 400 }
        );
      }

      // 如果是 data URL，直接使用；如果是普通 URL，也直接使用
      if (
        inputImage.startsWith("data:") ||
        inputImage.startsWith("http://") ||
        inputImage.startsWith("https://")
      ) {
        requestBody.image = inputImage;
        console.log("使用参考图进行图生图生成");
      } else {
        return NextResponse.json(
          { success: false, error: "图片字段需为 data URL 或 HTTP(S) URL" },
          { status: 400 }
        );
      }
    }

    try {
      // 调用 API
      console.log("开始调用 API：", ARK_API_URL);
      const response = await fetch(ARK_API_URL + "/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ARK_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ARK API 调用失败：", response.status, errorText);
        return NextResponse.json(
          {
            success: false,
            error: "ARK API 请求失败",
            details: errorText || `HTTP ${response.status}`,
          },
          { status: response.status }
        );
      }

      const responseData = await response.json();
      console.log("ARK API 响应：", responseData);

      // 处理响应
      if (
        !responseData.data ||
        !Array.isArray(responseData.data) ||
        responseData.data.length === 0
      ) {
        console.error("ARK API 响应缺少图片数据", { responseData });
        return NextResponse.json(
          { success: false, error: "ARK API 响应中没有图片数据" },
          { status: 500 }
        );
      }

      const imageUrl = responseData.data[0].url;
      if (!imageUrl) {
        console.error("ARK API 响应中缺少图片 URL", { responseData });
        return NextResponse.json(
          { success: false, error: "ARK API 响应中没有图片 URL" },
          { status: 500 }
        );
      }

      // 下载图片并转换为 base64 data URL（保持与前端兼容）
      let imageDataUrl: string;
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`拉取图片失败：${imageResponse.status}`);
        }
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString("base64");
        const contentType =
          imageResponse.headers.get("content-type") || "image/png";
        imageDataUrl = `data:${contentType};base64,${imageBase64}`;
      } catch (error) {
        console.error("从 URL 下载图片失败：", error);
        // 如果下载失败，直接返回 URL
        imageDataUrl = imageUrl;
      }

      // 返回结果（保持与前端兼容的格式）
      return NextResponse.json({
        success: true,
        image: imageDataUrl,
        description: null, // API 不返回文本描述
      });
    } catch (error) {
      console.error("调用 ARK API 出错：", error);
      const errorMessage =
        error instanceof Error ? error.message : "调用 ARK API 时出现未知错误";
      return NextResponse.json(
        { success: false, error: "ARK API 调用异常", details: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("生成图片时发生异常：", error);
    return NextResponse.json(
      {
        success: false,
        error: "生成图片失败",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
