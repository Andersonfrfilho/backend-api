export interface HealthCheckMethodResponse {
  status: boolean;
}
export interface HealthCheckMethodServiceResponse
  extends Promise<HealthCheckMethodResponse> {}
export interface HealthCheckMethodControllerResponse
  extends Promise<HealthCheckMethodResponse> {}

export interface HealthCheckInterface {
  healthCheck(): Promise<HealthCheckMethodResponse>;
}

export interface HealthCheckServiceInterface extends HealthCheckInterface {}
export interface HealthCheckControllerInterface extends HealthCheckInterface {}
