import { HealthCheckResponseDto } from '../shared/health.dto';

export interface HealthCheckServiceResponse extends HealthCheckResponseDto {}
export interface HealthCheckUseCaseResponse extends HealthCheckServiceResponse {}

export interface HealthCheckServiceInterface {
  execute(): HealthCheckServiceResponse;
}

export interface HealthCheckUseCaseInterface {
  execute(): HealthCheckUseCaseResponse;
}
