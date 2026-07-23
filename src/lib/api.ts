export const GEMINI_API_KEY_STORAGE_KEY = 'GEMINI_API_KEY';

export function getStoredGeminiApiKey(): string | null {
  const key = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
  return key && key.trim() ? key.trim() : null;
}

export function setStoredGeminiApiKey(key: string): void {
  localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key.trim());
}

export function removeStoredGeminiApiKey(): void {
  localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
}

export function getApiUrl(path: string): string {
  const customBase = localStorage.getItem('CUSTOM_API_BASE_URL');
  if (customBase) {
    const base = customBase.endsWith('/') ? customBase.slice(0, -1) : customBase;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `${base}${cleanPath}`;
  }
  return path;
}

export function getAiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const apiKey = getStoredGeminiApiKey();
  if (apiKey) {
    headers['X-Gemini-API-Key'] = apiKey;
  }
  return headers;
}

