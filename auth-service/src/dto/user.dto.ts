import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    dni: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    confirmPassword: string;
}

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    dni: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class UpdateUserProfileDto {
    @IsOptional()
    @IsString()
    nombres?: string;

    @IsOptional()
    @IsString()
    apellidos?: string;
}

export class GetUserInfoDto {
    @IsNotEmpty()
    @IsString()
    dni: string;
}

export interface UserInfo {
    dni: string;
    nombres: string;
    apellidos: string;
    email?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        dni: string;
        email: string;
        nombres: string;
        apellidos: string;
    };
    token?: string;
}