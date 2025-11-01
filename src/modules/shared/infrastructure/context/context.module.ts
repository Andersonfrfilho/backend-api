import { MiddlewareConsumer, NestModule } from '@nestjs/common';

import { RequestContextMiddleware } from '@modules/shared/infrastructure/context/middleware/request-context.middleware';

export class SharedInfrastructureContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
