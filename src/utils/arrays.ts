import { trimString } from "./text";

export function areListsEqual(list1: string[], list2: string[]): boolean {
  if (list1.length !== list2.length) {
    return false;
  }

  if (list1.length === list2.length && list1.length === 0) {
    return true;
  }

  const newList1 = [...list1];
  const newList2 = [...list2];
  newList1.sort();
  newList2.sort();
  let areEqual: boolean = true;
  for (let i: number = 0; i < newList1.length; i++) {
    if (newList1[i] !== newList2[i]) {
      areEqual = false;
    }
  }

  return areEqual;
}

export function extractStringArrayFromText(text: string): string[] {
  text = trimString(text);
  if (text) {
    if (text.startsWith("[") && text.endsWith("]")) {
      text = trimString(text.substr(1, text.length - 2));
    }
    if (text) {
      return text.split(",");
    }
  }
  return [];
}
