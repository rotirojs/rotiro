"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouteName = void 0;
function getRouteName(path, paths) {
    for (const endpoint of paths) {
        const match = path.match(endpoint.pattern);
        if (match) {
            return endpoint.routeName;
        }
    }
    return '';
}
exports.getRouteName = getRouteName;
//# sourceMappingURL=path-matcher.js.map