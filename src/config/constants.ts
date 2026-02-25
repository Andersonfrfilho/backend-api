export const ENV_VARS = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  PROJECT_NAME: 'PROJECT_NAME',
  BASE_URL: 'BASE_URL',
  DATABASE_POSTGRES_HOST: 'DATABASE_POSTGRES_HOST',
  DATABASE_POSTGRES_PORT: 'DATABASE_POSTGRES_PORT',
  DATABASE_POSTGRES_NAME: 'DATABASE_POSTGRES_NAME',
  DATABASE_POSTGRES_USER: 'DATABASE_POSTGRES_USER',
  DATABASE_POSTGRES_PASSWORD: 'DATABASE_POSTGRES_PASSWORD',
  DATABASE_POSTGRES_SYNCHRONIZE: 'DATABASE_POSTGRES_SYNCHRONIZE',
  DATABASE_POSTGRES_LOGGING: 'DATABASE_POSTGRES_LOGGING',
  DB_TIMEZONE: 'DB_TIMEZONE',
  BASE_URL_DEVELOPMENT: 'BASE_URL_DEVELOPMENT',
  BASE_URL_STAGING: 'BASE_URL_STAGING',
  BASE_URL_PRODUCTION: 'BASE_URL_PRODUCTION',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const SWAGGER_CUSTOM_CSS = `
  .topbar { 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .topbar-wrapper {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  .swagger-ui .topbar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .swagger-ui .model-box {
    background: #f9f9f9;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }
  .swagger-ui .btn {
    border-radius: 4px;
    font-weight: 600;
  }
  .swagger-ui .btn-execute {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
  }
  .swagger-ui .btn-execute:hover {
    background: linear-gradient(135deg, #5568d3 0%, #69398e 100%);
  }
  .swagger-ui .info .title {
    font-size: 36px;
    font-weight: 700;
    color: #333;
    margin-top: 20px;
  }
  .swagger-ui .info .description {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
  }
  .swagger-ui section.models {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    background: #fafafa;
  }
  .swagger-ui .model {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }
  .swagger-ui .opblock {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    margin-bottom: 15px;
  }
  .swagger-ui .opblock.opblock-get {
    background: rgba(102, 126, 234, 0.05);
    border-left: 4px solid #667eea;
  }
  .swagger-ui .opblock.opblock-post {
    background: rgba(76, 175, 80, 0.05);
    border-left: 4px solid #4caf50;
  }
  .swagger-ui .opblock.opblock-put {
    background: rgba(255, 193, 7, 0.05);
    border-left: 4px solid #ffc107;
  }
  .swagger-ui .opblock.opblock-delete {
    background: rgba(244, 67, 54, 0.05);
    border-left: 4px solid #f44336;
  }
  .swagger-ui .opblock.opblock-patch {
    background: rgba(156, 39, 176, 0.05);
    border-left: 4px solid #9c27b0;
  }
  .swagger-ui .response-col_status {
    font-weight: 600;
  }
  .swagger-ui .scheme-container {
    background: #f9f9f9;
    border-radius: 4px;
  }
`;
