export interface LoggingIgnoreConfig {
  enabled: boolean;
  ignoredRoutes: string[] | RegExp[];
}

export const DEFAULT_LOGGING_IGNORE_CONFIG: LoggingIgnoreConfig = {
  enabled: true,
  ignoredRoutes: ['/health', '/metrics', '/docs', '/api-docs'],
};

export const shouldIgnoreRoute = (path: string, ignoredRoutes: (string | RegExp)[]): boolean => {
  if (!ignoredRoutes || ignoredRoutes.length === 0) {
    return false;
  }

  const pathWithoutQuery = path.split('?')[0];

  return ignoredRoutes.some((route) => {
    if (route instanceof RegExp) {
      return route.test(pathWithoutQuery);
    }

    return pathWithoutQuery === route || pathWithoutQuery.startsWith(`${route}/`);
  });
};
