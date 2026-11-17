import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global API Prefix
  app.setGlobalPrefix('api/v1');

  // Global CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'X-Requested-With'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Interceptor and Filter
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger Documentation on /api/docs
  const config = new DocumentBuilder()
    .setTitle('CubeAI Solutions HRMS API')
    .setDescription('Multi-Tenant Core HR & Employee Lifecycle Management REST APIs')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'X-Tenant-ID', in: 'header' }, 'X-Tenant-ID')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`CubeAI HRMS Backend running on port ${port} (API: http://localhost:${port}/api/v1, Swagger: http://localhost:${port}/api/docs)`);
}
bootstrap();
