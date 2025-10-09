import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

export function handleMicroserviceError(err: any) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';

    console.log( err instanceof RpcException )

    if (err instanceof RpcException) {
        const error = err.getError() as any;
        console.log(error.status)
        if (typeof error === 'object' && error !== null) {
            status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            message = error.message || 'Error en microservicio';
        } else {
            message = error?.toString() || 'Error en microservicio';
        }
    } else if (err?.message) {
        message = err.message;
    } else if (typeof err === 'string') {
        message = err;
    }

    console.log('Microservice error handled:', { status, message });

    return throwError(() => new HttpException(message, status));
}