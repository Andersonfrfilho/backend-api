import { HealthCheckResponseDto } from '@modules/health/health.dto';

export const HEALTH_CHECK_SERVICE_PROVIDER = 'HEALTH_CHECK_SERVICE_PROVIDER';

export interface HealthCheckMethodServiceResponse
  extends HealthCheckResponseDto {}
export interface HealthCheckControllerResponse extends HealthCheckResponseDto {}

export interface HealthCheckServiceInterface {
  execute(): HealthCheckMethodServiceResponse;
}
