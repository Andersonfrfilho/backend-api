// Temporary ambient module declarations to satisfy TypeScript while
// the private package and some path-mapped imports are being resolved.

declare module '@adatechnology/http-client' {
  // Expose minimal types used by this project — concrete package will provide full types.
  import type { ModuleMetadata } from '@nestjs/common';

  export const HttpModule: any;
  export type HttpProviderInterface = any;
  export function HttpModuleFactory(config?: any, options?: any): any;

  export default HttpModule;
}

declare module '@backend/package-nestjs' {
  export const SHARED_SERVICE_PROVIDE: string;
  export interface SharedServiceInterface {
    getPrefix(): string;
  }
  export const SharedModule: any;
}

// Allow path-mapped internal module imports to resolve as 'any' when TS can't find files.
declare module '@modules/*' {
  const value: any;
  export default value;
}

// Specific provider-level wildcard for local providers
declare module '@modules/shared/infrastructure/providers/*' {
  const value: any;
  export default value;
}
