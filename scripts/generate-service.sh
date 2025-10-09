#!/bin/bash

# Script para generar un nuevo microservicio y su gateway controller
# Uso: ./generate-service.sh nombre-servicio puerto

SERVICE_NAME=$1
SERVICE_PORT=$2

if [ -z "$SERVICE_NAME" ] || [ -z "$SERVICE_PORT" ]; then
    echo "❌ Uso: ./generate-service.sh nombre-servicio puerto"
    echo "   Ejemplo: ./generate-service.sh user-service 3003"
    exit 1
fi

echo "🏗️  Generando microservicio: $SERVICE_NAME en puerto $SERVICE_PORT"

# Crear estructura del microservicio
mkdir -p $SERVICE_NAME/src/app

# Generar controller template
cat > $SERVICE_NAME/src/app/${SERVICE_NAME%.service}.controller.ts << EOF
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ${SERVICE_NAME^}Service } from './${SERVICE_NAME%.service}.service';

@Controller('${SERVICE_NAME%.service}')
export class ${SERVICE_NAME^}Controller {
  constructor(private readonly ${SERVICE_NAME%.service}Service: ${SERVICE_NAME^}Service) {}

  // HTTP endpoints (debugging)
  @Get('health')
  async httpHealth() {
    return await this.${SERVICE_NAME%.service}Service.healthCheck();
  }

  // Message patterns (microservice communication)
  @MessagePattern({ cmd: 'health' })
  async health() {
    return await this.${SERVICE_NAME%.service}Service.healthCheck();
  }

  // TODO: Agregar más endpoints según necesidades
}
EOF

# Generar gateway controller template
mkdir -p api-gateway/src/controllers
cat > api-gateway/src/controllers/${SERVICE_NAME%.service}-gateway.controller.ts << EOF
import { Controller, Get } from '@nestjs/common';
import { GatewayService } from '../services/gateway.service';
import { Observable } from 'rxjs';

@Controller('api/${SERVICE_NAME%.service}')
export class ${SERVICE_NAME^}GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get('health')
  healthCheck(): Observable<any> {
    return this.gatewayService.sendTo${SERVICE_NAME^}('health', {});
  }

  // TODO: Agregar más endpoints según necesidades
}
EOF

echo "✅ Generado:"
echo "   📁 $SERVICE_NAME/src/app/${SERVICE_NAME%.service}.controller.ts"
echo "   📁 api-gateway/src/controllers/${SERVICE_NAME%.service}-gateway.controller.ts"
echo ""
echo "📝 Próximos pasos:"
echo "1. Implementar ${SERVICE_NAME^}Service"
echo "2. Agregar configuración en api-gateway/src/app.module.ts"
echo "3. Actualizar GatewayService con métodos sendTo${SERVICE_NAME^}"