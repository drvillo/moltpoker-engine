/**
 * Shared LLM provider constants used by API, agents, simulator, and web admin.
 */

export const PROVIDER_ENV_MAP = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  google: 'GOOGLE_GENERATIVE_AI_API_KEY',
  openrouter: 'OPENROUTER_KEY',
} as const;

export const PROVIDER_ENV_ALIASES: Record<string, readonly string[]> = {
  openrouter: ['OPENROUTER_API_KEY'],
};

export const SUPPORTED_PROVIDERS = Object.keys(PROVIDER_ENV_MAP);

export const SUPPORTED_MODEL_PROVIDERS = ['openai', 'anthropic', 'openrouter'] as const;

export type ProviderId = keyof typeof PROVIDER_ENV_MAP;
export type SupportedModelProvider = (typeof SUPPORTED_MODEL_PROVIDERS)[number];

export function normalizeProvider(provider: string): string {
  return provider.trim().toLowerCase();
}

export function getProviderEnvVar(provider: string): string | undefined {
  const normalized = normalizeProvider(provider) as ProviderId;
  return PROVIDER_ENV_MAP[normalized];
}

export function getProviderEnvCandidates(provider: string): string[] {
  const envVar = getProviderEnvVar(provider);
  if (!envVar) return [];

  const normalized = normalizeProvider(provider);
  const aliases = PROVIDER_ENV_ALIASES[normalized] ?? [];
  return [envVar, ...aliases];
}

export function getProviderApiKeyFromEnv(
  provider: string,
  env: Record<string, string | undefined>,
): string | undefined {
  const candidates = getProviderEnvCandidates(provider);
  for (const key of candidates) {
    const value = env[key];
    if (value && value.trim().length > 0) return value;
  }
  return undefined;
}
