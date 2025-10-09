import { Controller, Post, Get, Body, Headers, Param, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { handleMicroserviceError } from '../utils/error-handler';

@Controller('auth')
export default class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

    @Post('login')
    async login(@Body() body: { dni: string; password: string }) {
        return this.client
            .send({ cmd: 'login' }, body)
            .pipe(
                catchError(handleMicroserviceError)
            );
    }

    @Post('register')
    async register(@Body() body: any) {
        return this.client
            .send({ cmd: 'register' }, body)
            .pipe(
                catchError(handleMicroserviceError)
            );
    }
}