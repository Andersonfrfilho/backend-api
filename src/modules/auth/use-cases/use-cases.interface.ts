import { CommonInterfaceFormScreen } from '@common/interfaces/commons.interface';

export interface AuthLoginSessionUseCaseResponse
  extends CommonInterfaceFormScreen {}
export interface AuthLoginSessionUseCaseInterface {
  execute(): Promise<AuthLoginSessionUseCaseResponse>;
}
