import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import fastifyHelmet from '@fastify/helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { register as tsConfigPathsRegister } from 'tsconfig-paths';

import { swaggerCustomOptions } from '@config/swagger-custom.config';
import { swaggerConfig } from '@config/swagger.config';
import { AppErrorFactory } from '@modules/error';
import { docsFactory } from '@modules/shared/infrastructure/interceptors/docs';

import * as tsConfig from '../tsconfig.json';

import { AppModule } from './app.module';
import { EnvironmentProviderInterface } from './config';
import { ENVIRONMENT_SERVICE_PROVIDER } from './config/config.token';

const compilerOptions = tsConfig.compilerOptions;
tsConfigPathsRegister({
  baseUrl: compilerOptions.baseUrl,
  paths: compilerOptions.paths,
});

async function bootstrap() {
  const instanceFastify = new FastifyAdapter({
    bodyLimit: 102400, // 100KB - limite de payload
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, instanceFastify);

  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 3600,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      forbidNonWhitelisted: false,
      transform: true,
      whitelist: true,
      skipMissingProperties: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => AppErrorFactory.fromValidationErrors(errors),
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const environment = app.get<EnvironmentProviderInterface>(ENVIRONMENT_SERVICE_PROVIDER);
  const document = SwaggerModule.createDocument(app, swaggerConfig(environment));
  SwaggerModule.setup('docs', app, document, swaggerCustomOptions(environment));
  const outputPath = join(process.cwd(), 'swagger-spec.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  docsFactory({ app, document });

  await app.listen(process.env.PORT ?? 3333, '0.0.0.0');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
