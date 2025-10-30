import { ReDocThemeConfig } from './redoc.theme';

export interface ReDocConfig {
  title?: string;
  theme?: ReDocThemeConfig;
  specUrl?: string;
  untrustedSpec?: boolean;
}

export const DEFAULT_REDOC_CONFIG: ReDocConfig = {
  title: 'ReDoc - API Documentation',
  theme: {},
  specUrl: '/swagger-spec',
  untrustedSpec: true,
};
