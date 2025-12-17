export { BaseErrorFactory } from './base.error.factory';
export { ConfigErrorFactory } from './config.error.factory';
export { MethodNotImplementedErrorFactory } from './method-not-implemented.error.factory';

// Re-export module-specific factories from their respective modules
export { AuthErrorFactory } from '@modules/auth/application/factories';
export { RateLimitErrorFactory } from '@modules/shared/application/factories';
export { UserErrorFactory } from '@modules/user/application/factories';
