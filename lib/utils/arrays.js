"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStringArrayFromText = exports.areListsEqual = void 0;
const text_1 = require("./text");
function areListsEqual(list1, list2) {
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
    let areEqual = true;
    for (let i = 0; i < newList1.length; i++) {
        if (newList1[i] !== newList2[i]) {
            areEqual = false;
        }
    }
    return areEqual;
}
exports.areListsEqual = areListsEqual;
function extractStringArrayFromText(text) {
    text = text_1.trimString(text);
    if (text) {
        if (text.startsWith('[') && text.endsWith(']')) {
            text = text_1.trimString(text.substr(1, text.length - 2));
        }
        if (text) {
            return text.split(',');
        }
    }
    return [];
}
exports.extractStringArrayFromText = extractStringArrayFromText;
//# sourceMappingURL=arrays.js.map