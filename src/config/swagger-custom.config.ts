import { SwaggerCustomOptions } from '@nestjs/swagger/dist/interfaces/swagger-custom-options.interface';

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    filter: true,
    showRequestHeaders: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
  },
  customCss: `
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
  `,
  customSiteTitle: 'Backend Service API Documentation',
};
