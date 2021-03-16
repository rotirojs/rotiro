import {ApiRequestParam} from '../../type-defs';

export function validateRequest(
  path: Record<string, ApiRequestParam>,
  body: Record<string, ApiRequestParam>,
  query: Record<string, ApiRequestParam>
): boolean {
  if (path) {
    for (const pathValue of Object.values(path)) {
      if (!pathValue.valid) {
        return false;
      }
    }
  }

  if (body) {
    for (const bodyValue of Object.values(body)) {
      if (!bodyValue.valid) {
        return false;
      }
    }
  }

  if (query) {
    for (const queryValue of Object.values(query)) {
      if (!queryValue.valid) {
        return false;
      }
    }
  }

  return true;
}
