import { Controller, Get, Post, Body, Param, Put, ValidationPipe, UsePipes, UseFilters } from '@nestjs/common';
import { MessagePattern, EventPattern, RpcException } from '@nestjs/microservices';
import AuthService from './auth.service';
import { RegisterUserDto, LoginUserDto, UpdateUserProfileDto, GetUserInfoDto } from './dto/user.dto';

@Controller('auth')
export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern({ cmd: 'login' })
    async loginMicroservice(data: LoginUserDto) {
        return await this.authService.login(data);
    }

    @MessagePattern({ cmd: 'register' })
    async registerMicroservice(data: RegisterUserDto) {
        return await this.authService.register(data);
    }

    @MessagePattern({ cmd: 'update_profile' })
    async updateProfileMicroservice(data: { userId: string; updateData: UpdateUserProfileDto }) {
        return await this.authService.updateUserProfile(data.userId, data.updateData);
    }

    @MessagePattern({ cmd: 'get_user_info' })
    async getUserInfoMicroservice(data: { dni: string }) {
        return await this.authService.getUserInfo(data.dni);
    }

    @MessagePattern({ cmd: 'get_user_by_id' })
    async getUserByIdMicroservice(data: { userId: string }) {
        return await this.authService.getUserById(data.userId);
    }

    @EventPattern('user_created')
    async handleUserCreated(data: any) {
        console.log('Usuario creado:', data);
    }
}