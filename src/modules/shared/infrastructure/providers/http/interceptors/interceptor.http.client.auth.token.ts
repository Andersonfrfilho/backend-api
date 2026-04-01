// Lightweight attachAuthTokenInterceptor shim for environments without axios
export const attachAuthTokenInterceptor = (axiosInstance: any, authProvider: any, logger?: any) => {
  if (!axiosInstance || !axiosInstance.interceptors) return;

  axiosInstance.interceptors.request.use(async (config: any) => {
    try {
      const token = await authProvider.getAccessToken?.();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      logger?.error?.({ message: 'attachAuthTokenInterceptor - failed to get token', error: e });
    }
    return config;
  });
};

export default attachAuthTokenInterceptor;
