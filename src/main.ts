import { register as tsConfigPathsRegister } from 'tsconfig-paths';
import * as tsConfig from '../tsconfig.json';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { swaggerConfig } from '@config/swagger.config';
import { swaggerCustomOptions } from '@config/swagger-custom.config';
import { docsFactory } from '@core/interceptors/docs';

const compilerOptions = tsConfig.compilerOptions;
tsConfigPathsRegister({
  baseUrl: compilerOptions.baseUrl,
  paths: compilerOptions.paths,
});

async function bootstrap() {
  const instanceFastify = new FastifyAdapter({
    bodyLimit: 1048576,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    instanceFastify,
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, swaggerCustomOptions);
  const outputPath = join(process.cwd(), 'swagger-spec.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  docsFactory({ app, document });

  await app.listen(process.env.PORT ?? 3333, '0.0.0.0');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
