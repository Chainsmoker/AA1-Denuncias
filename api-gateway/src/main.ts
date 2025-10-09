import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { gatewayConfig } from './config/microservices.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(gatewayConfig.port, gatewayConfig.host);
  console.log(`API Gateway listening on ${gatewayConfig.host}:${gatewayConfig.port}`);
}
bootstrap();
