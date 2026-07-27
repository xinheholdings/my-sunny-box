import { getServerEnv } from "./env";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAIResponse = {
  error?: { message?: string };
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

const SYSTEM_PROMPT = `你是 SunnyBox AI，是为 SunnyBox 项目创建的 AI 助手。
请使用清晰、友好、务实的中文回答。优先帮助用户梳理想法、学习知识、制定计划和推进 AI 产品。
不知道的内容要坦率说明；不要声称执行了你无法执行的操作。`;

function extractText(response: OpenAIResponse): string {
  return (
    response.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text")
      .map((item) => item.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

export async function createChatResponse(messages: ChatMessage[]) {
  const env = getServerEnv();

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      instructions: SYSTEM_PROMPT,
      input: messages,
      reasoning: { effort: "low" },
      text: { verbosity: "medium" },
      max_output_tokens: 1200,
    }),
  });

  const data = (await response.json()) as OpenAIResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || `OpenAI request failed (${response.status})`);
  }

  const text = extractText(data);
  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }

  return {
    text,
    model: env.OPENAI_MODEL,
  };
}
