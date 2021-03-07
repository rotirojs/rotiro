"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryAsObject = exports.splitFullPath = exports.sanitisePath = exports.cleanBasePath = void 0;
const text_1 = require("./text");
function cleanBasePath(path) {
    path = text_1.trimString(path);
    if (path.length === 0) {
        return '';
    }
    if (path.length === 1 && path === '/') {
        return '';
    }
    if (path.endsWith('/')) {
        path = text_1.trimString(path.substr(0, path.length - 1));
    }
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return path;
}
exports.cleanBasePath = cleanBasePath;
function sanitisePath(path) {
    let routePath = text_1.trimString(path);
    if (routePath === '/') {
        return routePath;
    }
    if (!routePath.startsWith('/')) {
        routePath = `/${routePath}`;
    }
    const queryParamsPos = path.indexOf('?');
    if (queryParamsPos > -1) {
        routePath = routePath.substr(0, queryParamsPos);
    }
    if (routePath.endsWith('/')) {
        routePath = routePath.substr(0, routePath.length - 1);
    }
    return routePath;
}
exports.sanitisePath = sanitisePath;
function splitFullPath(fullPath) {
    let path = fullPath;
    let query = '';
    if (fullPath.indexOf('?') > -1) {
        const pathParts = fullPath.split('?');
        path = pathParts[0] || '';
        query = pathParts[1] || '';
    }
    if (path.length > 0 && !path.startsWith('/')) {
        path = '/' + path;
    }
    if (path.length > 1 && path.endsWith('/')) {
        path = path.substr(0, path.length - 1);
    }
    return { path, query };
}
exports.splitFullPath = splitFullPath;
function getQueryAsObject(query) {
    const queryData = {};
    query = text_1.trimString(query);
    if (query.startsWith('?')) {
        query = query.substr(1);
        query = text_1.trimString(query);
    }
    if (query.length === 0) {
        return {};
    }
    const queryParts = query.split('&');
    for (const queryPart of queryParts) {
        if (queryPart.indexOf('=') > -1) {
            const nameValue = queryPart.split('=');
            queryData[decodeURIComponent(nameValue[0])] = decodeURIComponent(text_1.trimString(nameValue[1]));
        }
        else {
            queryData[decodeURIComponent(queryPart)] = '';
        }
    }
    return queryData;
}
exports.getQueryAsObject = getQueryAsObject;
//# sourceMappingURL=paths.js.map