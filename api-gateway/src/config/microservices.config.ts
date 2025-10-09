import dotenv from 'dotenv';

dotenv.config();

export const microservicesConfig = {
  AUTH_SERVICE: {
    transport: 'TCP',
    host: process.env.AUTH_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.AUTH_SERVICE_PORT || '3002'), // Puerto del microservicio TCP, no HTTP
  },
  // Puedes agregar más microservicios aquí
  // USER_SERVICE: {
  //   transport: 'TCP',
  //   host: process.env.USER_SERVICE_HOST || 'localhost',
  //   port: parseInt(process.env.USER_SERVICE_PORT || '3003'),
  // },
};

export const gatewayConfig = {
  port: parseInt(process.env.GATEWAY_PORT || '3000'),
  host: process.env.GATEWAY_HOST || 'localhost',
};