import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { getEnv } from './config/env';

async function bootstrap() {
  const env = getEnv();
  const adapter = new FastifyAdapter();
  adapter.enableCors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  app.enableShutdownHooks();
  await app.register(helmet as never);
  await app.register(rateLimit as never, {
    global: true,
    max: env.API_RATE_LIMIT_MAX,
    timeWindow: env.API_RATE_LIMIT_WINDOW,
  });
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Musallih API')
    .setDescription('Open Islamic Civic Infrastructure Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  const port = env.PORT;
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
