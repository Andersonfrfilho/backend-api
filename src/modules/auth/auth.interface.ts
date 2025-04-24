import { CommonInterfaceFormScreen } from '../commons/commons.interface';

export const AUTH_SERVICE_PROVIDE = 'AUTH_SERVICE_PROVIDE';
export interface AuthServiceInterfaceLoginSessionServiceResponse
  extends CommonInterfaceFormScreen {}

export interface AuthServiceInterface {
  loginSessionService(): Promise<AuthServiceInterfaceLoginSessionServiceResponse>;
}
