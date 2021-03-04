import { RouteNamePattern } from '../type-defs';

export function getRouteName(path: string, paths: RouteNamePattern[]): string {
  for (const endpoint of paths) {
    const match = path.match(endpoint.pattern);
    if (match) {
      return endpoint.routeName;
    }
  }

  return '';
}
