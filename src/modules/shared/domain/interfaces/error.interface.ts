export interface ValidationError {
  field: string;
  message: string;
  constraint?: string;
}

export interface ErrorDetails {
  code: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path?: string;
  validation?: ValidationError[];
}
