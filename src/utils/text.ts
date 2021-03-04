export function trimString(value: string | null | undefined): string {
  value = (value || '').trim();
  return value;
}
