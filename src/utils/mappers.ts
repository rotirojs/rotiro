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

export function jsonMapper(text: string | string[]): object | object[] {
  if (Array.isArray(text)) {
    const mappedValues: object[] = [];
    for (const textValue of text) {
      mappedValues.push(JSON.parse(textValue));
    }
    return mappedValues;
  } else {
    return JSON.parse(text);
  }
}
