import { Module } from '@nestjs/common';
import { ProviderModule } from '@core/providers/provider.module';
import { InterceptorModule } from '@core/interceptors/interceptor.module';
@Module({
  imports: [InterceptorModule, ProviderModule],
  exports: [InterceptorModule, ProviderModule],
})
export class CoreModule {}
