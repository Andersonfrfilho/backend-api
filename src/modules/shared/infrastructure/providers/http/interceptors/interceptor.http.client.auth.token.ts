import type { AxiosInstance } from 'axios';

/**
 * Attach an auth-token interceptor to an Axios instance.
 * It will call the provided `authProvider.getAccessToken()` before each request
 * and add `Authorization: Bearer <token>` header, skipping requests to Keycloak itself.
 */
export const attachAuthTokenInterceptor = (
  axiosInstance: AxiosInstance,
  authProvider: { getAccessToken: () => Promise<string> },
  logger?: { info?: (...args: any[]) => void },
) => {
  if (!axiosInstance || !axiosInstance.interceptors) return;

  axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        if (config && config.url && config.url.includes('keycloak')) {
          // don't attach token when calling Keycloak itself
          return config;
        }

        // If an Authorization header is already present (set earlier by a provider), skip acquiring a token
        const headers = (config && config.headers) as Record<string, any> | undefined;
        const hasAuthHeader = headers && (headers['Authorization'] || headers['authorization']);
        if (hasAuthHeader) {
          logger?.info?.({
            message:
              'InterceptorHttpClientAuthToken - Authorization header already present, skipping',
            params: { url: config?.url },
          });
          return config;
        }

        logger?.info?.({
          message: 'InterceptorHttpClientAuthToken - acquiring token',
          params: { url: config?.url },
        });
        const token = await authProvider.getAccessToken();
        logger?.info?.({
          message: 'InterceptorHttpClientAuthToken - token acquired',
          params: { url: config?.url },
        });

        if (!config.headers) config.headers = {} as any;
        config.headers['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        // don't block request on interceptor failures
        logger?.info?.({
          message: 'InterceptorHttpClientAuthToken - error acquiring token',
          params: { error: (e as any)?.message },
        });
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

export default attachAuthTokenInterceptor;
