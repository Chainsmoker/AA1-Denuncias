import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuthGatewayController from './controllers/auth.controller';
import dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.AUTH_SERVICE_PORT || '3002'),
        },
      },
    ]),
  ],
  controllers: [AuthGatewayController],
  providers: [],
})
export class AppModule {}
