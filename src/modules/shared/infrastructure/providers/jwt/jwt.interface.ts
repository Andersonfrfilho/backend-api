import type { SignOptions, VerifyOptions, DecodeOptions } from 'jsonwebtoken';

/**
 * JWT (JSON Web Token) provider interface
 */
export interface JwtProviderInterface {
  /**
   * Sign a payload to create a JWT token
   */
  sign(payload: Record<string, any>, options?: JwtSignOptions): string;

  /**
   * Verify and decode a JWT token
   */
  verify<T = any>(token: string, options?: JwtVerifyOptions): T;

  /**
   * Decode a JWT token without verification
   */
  decode<T = any>(token: string, options?: JwtDecodeOptions): T;
}

/**
 * Options for JWT signing - extends jsonwebtoken SignOptions
 */
export interface JwtSignOptions extends Partial<SignOptions> {}

/**
 * Options for JWT verification - extends jsonwebtoken VerifyOptions
 */
export interface JwtVerifyOptions extends Partial<VerifyOptions> {}

/**
 * Options for JWT decoding - extends jsonwebtoken DecodeOptions
 */
export interface JwtDecodeOptions extends Partial<DecodeOptions> {}
