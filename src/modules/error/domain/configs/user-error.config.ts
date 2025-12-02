import type {
  BusinessLogicErrorConfig,
  ConflictErrorConfig,
  NotFoundErrorConfig,
} from '@modules/error/domain/configs/error-config.interface';
import { UserErrorCode } from '@modules/error/domain/error-codes';

export const USER_ERROR_CONFIGS = {
  duplicateEmail: (email: string): ConflictErrorConfig => ({
    message: 'User with this email already exists',
    code: UserErrorCode.DUPLICATE_EMAIL,
    details: { email },
  }),

  duplicateCpf: (cpf: string): ConflictErrorConfig => ({
    message: 'User with this CPF already exists',
    code: UserErrorCode.DUPLICATE_CPF,
    details: { cpf },
  }),

  duplicateRg: (rg: string): ConflictErrorConfig => ({
    message: 'User with this RG already exists',
    code: UserErrorCode.DUPLICATE_RG,
    details: { rg },
  }),

  notFound: (userId?: string): NotFoundErrorConfig => ({
    message: 'User not found',
    code: UserErrorCode.USER_NOT_FOUND,
    details: { userId },
  }),

  invalidPassword: (): BusinessLogicErrorConfig => ({
    message: 'Invalid password',
    code: UserErrorCode.INVALID_PASSWORD,
  }),

  accountDisabled: (userId: string): BusinessLogicErrorConfig => ({
    message: 'Account is disabled',
    code: UserErrorCode.ACCOUNT_DISABLED,
    details: { userId },
  }),

  emailNotVerified: (email: string): BusinessLogicErrorConfig => ({
    message: 'Email not verified',
    code: UserErrorCode.EMAIL_NOT_VERIFIED,
    details: { email },
  }),
} as const;
