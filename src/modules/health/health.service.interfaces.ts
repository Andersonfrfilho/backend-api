export interface HealthCheckMethodResponse {
  status: boolean;
}
export interface HealthCheckMethodServiceResponse
  extends HealthCheckMethodResponse {}
export interface HealthCheckMethodControllerResponse
  extends HealthCheckMethodResponse {}

export interface HealthCheckInterface {
  healthCheck(): HealthCheckMethodResponse;
}

export interface HealthCheckServiceInterface extends HealthCheckInterface {}
export interface HealthCheckControllerInterface extends HealthCheckInterface {}
