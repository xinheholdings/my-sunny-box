type ServerEnv = {
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
};

export function getServerEnv(): ServerEnv {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-5.6-sol";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY_MISSING");
  }

  return {
    OPENAI_API_KEY: apiKey,
    OPENAI_MODEL: model,
  };
}
