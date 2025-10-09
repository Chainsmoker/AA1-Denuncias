import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/rpc-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: parseInt(process.env.MICROSERVICE_PORT || '3001'),
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Auth service running on:`);
  console.log(`- HTTP REST API: http://localhost:${port}`);
  console.log(`- TCP Microservice: localhost:${process.env.MICROSERVICE_PORT || '3001'}`);
}

bootstrap().catch(err => {
  console.error('Error starting auth service:', err);
  process.exit(1);
});
