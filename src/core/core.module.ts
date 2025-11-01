import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ProviderModule } from '@core/providers/provider.module';
import { InterceptorModule } from '@core/interceptors/interceptor.module';
import { RequestContextMiddleware } from '@core/middleware/request-context.middleware';

@Module({
  imports: [InterceptorModule, ProviderModule],
  exports: [InterceptorModule, ProviderModule],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
