import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonConfig } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global serialization interceptor to exclude sensitive fields
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Pariose ChurchNow API')
    .setDescription('REST API for church management system - Pariose ChurchNow')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management')
    .addTag('Roles', 'Role management (Super Admin only)')
    .addTag('Dashboard', 'Dashboard statistics and analytics')
    .addTag('Ecclesiastical Units', 'Church units and parishes management')
    .addTag('Celebrations', 'Mass schedules and liturgical celebrations')
    .addTag('Activities', 'Parish activities and events')
    .addTag('Announcements', 'Parish announcements and notices')
    .addTag('Confessions', 'Confession schedules')
    .addTag('Holy Places', 'Holy places and chapels management')
    .addTag('Sacred Objects', 'Sacred objects inventory management')
    .addTag('Languages', 'Liturgical languages management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Pariose ChurchNow API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`📝 Logs directory: logs/`);
}
bootstrap();
