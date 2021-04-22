import { trimString } from './text';

export function extractHeaderParam(
  headerName: string,
  headers: Record<string, string | string[]>
): string | string[] {
  const cleanHeaderName: string = trimString(headerName).toLowerCase();
  if (headers) {
    for (const key of Object.keys(headers)) {
      if (cleanHeaderName === trimString(key).toLowerCase()) {
        return headers[key];
      }
    }
  }
  return '';
}
