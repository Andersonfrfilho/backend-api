import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { register as tsConfigPathsRegister } from 'tsconfig-paths';

import { swaggerCustomOptions } from '@config/swagger-custom.config';
import { swaggerConfig } from '@config/swagger.config';
import { AppErrorFactory } from '@modules/error';
import { docsFactory } from '@modules/shared/infrastructure/interceptors/docs';

import * as tsConfig from '../tsconfig.json';

import { AppModule } from './app.module';

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
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
      skipMissingProperties: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) =>
        AppErrorFactory.fromValidationErrors(errors),
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
