import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RequestContextService } from './request-context.service';

import { RequestContextMiddleware } from '@modules/shared/infrastructure/context/middleware/request-context.middleware';

@Module({
  providers: [RequestContextService],
  exports: [RequestContextService],
})
export class SharedInfrastructureContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
