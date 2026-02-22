import * as jwt from 'jsonwebtoken';

import {
  JwtDecodeOptions,
  JwtProviderInterface,
  JwtSignOptions,
  JwtVerifyOptions,
} from '../../jwt.interface';

/**
 * JWT provider implementation using jsonwebtoken
 */
export class PassportJwtProvider implements JwtProviderInterface {
  constructor(
    private readonly secretOrPrivateKey: string,
    private readonly publicKey?: string,
  ) {}

  /**
   * Sign a payload to create a JWT token
   */
  sign(payload: Record<string, any>, options?: JwtSignOptions): string {
    return jwt.sign(payload, this.secretOrPrivateKey, options);
  }

  /**
   * Verify and decode a JWT token
   */
  verify<T = any>(token: string, options?: JwtVerifyOptions): T {
    return jwt.verify(token, this.publicKey || this.secretOrPrivateKey, options) as T;
  }

  /**
   * Decode a JWT token without verification
   */
  decode<T = any>(token: string, options?: JwtDecodeOptions): T {
    return jwt.decode(token, options) as T;
  }
}
