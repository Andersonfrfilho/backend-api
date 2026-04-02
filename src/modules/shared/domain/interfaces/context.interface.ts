export interface RequestContext {
  requestId: string;
  userId?: string;
  timestamp: Date;
  path: string;
  method: string;
  contextType: unknown;
}

export interface ApplicationContext {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
}
