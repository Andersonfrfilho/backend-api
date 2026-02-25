import { Inject, Injectable } from '@nestjs/common';

import type { PassportJwtProvider } from './implementations/passport/passport.jwt.provider';
import type {
  JwtProviderInterface,
  JwtSignOptions,
  JwtVerifyOptions,
  JwtDecodeOptions,
} from './jwt.interface';
import { JWT_JSONWEBTOKEN_PROVIDER } from './jwt.token';

/**
 * JWT provider that delegates to the JWT implementation
 */
@Injectable()
export class JwtProvider implements JwtProviderInterface {
  constructor(
    @Inject(JWT_JSONWEBTOKEN_PROVIDER)
    private readonly jwtProvider: PassportJwtProvider,
  ) {}

  /**
   * Sign a payload to create a JWT token
   */
  sign(payload: Record<string, any>, options?: JwtSignOptions): string {
    return this.jwtProvider.sign(payload, options);
  }

  /**
   * Verify and decode a JWT token
   */
  verify<T = any>(token: string, options?: JwtVerifyOptions): T {
    return this.jwtProvider.verify<T>(token, options);
  }

  /**
   * Decode a JWT token without verification
   */
  decode<T = any>(token: string, options?: JwtDecodeOptions): T {
    return this.jwtProvider.decode<T>(token, options);
  }
}
