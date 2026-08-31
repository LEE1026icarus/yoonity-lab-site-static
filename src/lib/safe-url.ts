export function safeHttpUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}
