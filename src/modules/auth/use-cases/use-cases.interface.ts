import { CommonInterfaceFormScreen } from 'src/modules/commons/commons.interface';

export interface AuthLoginSessionUseCaseResponse
  extends CommonInterfaceFormScreen {}
export interface AuthLoginSessionUseCaseInterface {
  execute(): Promise<AuthLoginSessionUseCaseResponse>;
}
