import { SwaggerCustomOptions } from '@nestjs/swagger/dist/interfaces/swagger-custom-options.interface';

import { SWAGGER_CUSTOM_CSS } from '@config/constants';
import { EnvironmentProviderInterface } from '@config/domain/interfaces/environment.interface';

interface SwaggerCustomConfigParams extends Partial<EnvironmentProviderInterface> {}

export const swaggerCustomOptions = (
  environment: SwaggerCustomConfigParams,
): SwaggerCustomOptions => ({
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    filter: true,
    showRequestHeaders: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
  },
  customCss: SWAGGER_CUSTOM_CSS,
  customSiteTitle: `${environment.projectName} API Documentation`,
});
