// create a path that will be the same regardless of variable name
import { trimString } from './text';

export function cleanBasePath(path: string): string {
  path = trimString(path);
  if (path.length === 0) {
    return '';
  }
  if (path.length === 1 && path === '/') {
    return '';
  }

  if (path.endsWith('/')) {
    path = trimString(path.substr(0, path.length - 1));
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  return path;
}

export function sanitisePath(path: string): string {
  // e.g. /test/:id/something
  // e.g. test/:id/something
  // e.g. test/:id/something/
  // /test/:/something
  let routePath: string = trimString(path);

  // append a slash
  if (!routePath.startsWith('/')) {
    routePath = `/${routePath}`;
  }

  // remove any query params
  const queryParamsPos: number = path.indexOf('?');
  if (queryParamsPos > -1) {
    routePath = routePath.substr(0, queryParamsPos);
  }

  // Remove any trailing slash
  if (routePath.endsWith('/')) {
    routePath = routePath.substr(0, routePath.length - 1);
  }

  return routePath;
  // const matches: RegExpMatchArray | null = routePath.match(/(\/)(:[^\/]+)/gi)
  // let paramNames: string[] = []
  // if (matches && matches.length) {
  //   paramNames = matches.map((match: string) => {
  //     return match.substr(2)
  //   })
  // }
  // routePath = routePath.replace(/(\/)(:[^\/]+)/gi, '/:')
  //
  // return { routePath, paramNames }
}

export function splitFullPath(
  fullPath: string
): { path: string; query: string } {
  let path: string = fullPath;
  let query: string = '';
  if (fullPath.indexOf('?') > -1) {
    const pathParts: string[] = fullPath.split('?');
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

export function getQueryAsObject(query: string): Record<string, string> {
  const queryData: Record<string, string> = {};
  query = trimString(query);
  if (query.startsWith('?')) {
    query = query.substr(1);
    query = trimString(query);
  }
  if (query.length === 0) {
    return {};
  }
  const queryParts: string[] = query.split('&');
  for (const queryPart of queryParts) {
    if (queryPart.indexOf('=') > -1) {
      const nameValue: string[] = queryPart.split('=');
      queryData[decodeURIComponent(nameValue[0])] = decodeURIComponent(
        trimString(nameValue[1])
      );
    } else {
      queryData[decodeURIComponent(queryPart)] = '';
    }
  }

  return queryData;
}
