import { trimString } from './text';

export function stringMapper(text: any | any[]): string | string[] {
  if (text === null || typeof text === 'undefined') {
    text = '';
  } else if (Array.isArray(text)) {
    return text.map((value: any) => stringMapper(value) as string);
  } else if (typeof text !== 'string') {
    text = text.toString();
  }

  return text;
}

export function booleanMapper(
  text: string | string[] | boolean | boolean[]
): boolean | boolean[] | undefined {
  if (Array.isArray(text)) {
    const mappedValues: boolean[] = [];
    for (const textValue of text) {
      if (typeof textValue === 'boolean') {
        mappedValues.push(textValue);
      } else {
        mappedValues.push(trimString(textValue).toLowerCase() === 'true');
      }
    }
    return mappedValues;
  } else {
    if (typeof text === 'boolean') {
      return text;
    }
    return trimString(text).toLowerCase() === 'true';
  }
}

export function numberMapper(
  text: string | string[]
): number | number[] | undefined {
  if (Array.isArray(text)) {
    const mappedValues: number[] = [];
    for (const textValue of text) {
      mappedValues.push(parseInt(textValue, 10));
    }
    return mappedValues;
  } else {
    const result = parseInt(text, 10);
    if (isNaN(result)) {
      return undefined;
    } else {
      return result;
    }
  }
}

export function jsonMapper(text: string | string[] | any[]): object | object[] {
  if (Array.isArray(text)) {
    const mappedValues: object[] = [];
    for (const item of text) {
      if (typeof item === 'string') {
        mappedValues.push(JSON.parse(item));
      } else {
        mappedValues.push(item);
      }
    }
    return mappedValues;
  } else {
    return JSON.parse(text);
  }
}
