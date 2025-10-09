import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getUserInfo } from './utils/reniec';
import { supabase } from './config/supabase.config';
import { RegisterUserDto, LoginUserDto, UpdateUserProfileDto, AuthResponse, UserInfo } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export default class AuthService {
    
    async register(registerDto: RegisterUserDto): Promise<AuthResponse> {
        const { dni, email, password, confirmPassword } = registerDto;

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            throw new RpcException({
                status: 400,
                message: 'Las contraseñas no coinciden'
            });
        }

        try {
            // Verificar si el usuario ya existe por DNI
            const { data: existingUserByDni } = await supabase
                .from('users')
                .select('dni')
                .eq('dni', dni)
                .single();

            if (existingUserByDni) {
                throw new RpcException({
                    status: 400,
                    message: 'Ya existe un usuario con este DNI'
                });
            }

            // Verificar si el usuario ya existe por email
            const { data: existingUserByEmail } = await supabase
                .from('users')
                .select('email')
                .eq('email', email)
                .single();

            if (existingUserByEmail) {
                throw new RpcException({
                    status: 400,
                    message: 'Ya existe un usuario con este email'
                });
            }

            // Obtener información del usuario usando el DNI
            const userInfo: UserInfo = await getUserInfo(dni);
            
            if (!userInfo) {
                throw new RpcException({
                    status: 400,
                    message: 'No se pudo obtener la información del DNI proporcionado'
                });
            }

            // Hashear la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Crear el usuario en Supabase
            const { data: newUser, error } = await supabase
                .from('users')
                .insert([
                    {
                        dni: dni,
                        email: email,
                        password: hashedPassword,
                        nombres: userInfo.nombres,
                        apellidos: userInfo.apellidos,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (error) {
                throw new RpcException({
                    status: 500,
                    message: `Error al crear el usuario: ${error.message}`
                });
            }

            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                user: {
                    id: newUser.id,
                    dni: newUser.dni,
                    email: newUser.email,
                    nombres: newUser.nombres,
                    apellidos: newUser.apellidos
                }
            };

        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            console.error('Error en registro:', error);
            throw new RpcException({
                status: 500,
                message: `Error en el registro: ${error.message || 'Error desconocido'}`
            });
        }
    }

    async login(loginDto: LoginUserDto): Promise<AuthResponse> {
        const { dni, password } = loginDto;

        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('dni', dni)
                .single();

            if (error || !user) {
                throw new RpcException({
                    status: 401,
                    message: 'Credenciales inválidas'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                throw new RpcException({
                    status: 401,
                    message: 'Credenciales inválidas'
                });
            }

            await supabase
                .from('users')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', user.id);

            return {
                success: true,
                message: 'Login exitoso',
                user: {
                    id: user.id,
                    dni: user.dni,
                    email: user.email,
                    nombres: user.nombres,
                    apellidos: user.apellidos
                }
            };

        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException({
                status: 500,
                message: `Error en el login: ${error.message || 'Error desconocido'}`
            });
        }
    }

    async updateUserProfile(userId: string, updateDto: UpdateUserProfileDto): Promise<AuthResponse> {
        const { nombres, apellidos } = updateDto;

        try {
            // Verificar que el usuario existe
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (fetchError || !existingUser) {
                throw new RpcException({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
            }

            // Preparar los datos a actualizar
            const updateData: any = {
                updated_at: new Date().toISOString()
            };

            if (nombres) updateData.nombres = nombres;
            if (apellidos) updateData.apellidos = apellidos;

            // Actualizar el usuario
            const { data: updatedUser, error } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                throw new RpcException({
                    status: 500,
                    message: `Error al actualizar el perfil: ${error.message}`
                });
            }

            return {
                success: true,
                message: 'Perfil actualizado exitosamente',
                user: {
                    id: updatedUser.id,
                    dni: updatedUser.dni,
                    email: updatedUser.email,
                    nombres: updatedUser.nombres,
                    apellidos: updatedUser.apellidos
                }
            };

        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException({
                status: 500,
                message: `Error al actualizar el perfil: ${error.message || 'Error desconocido'}`
            });
        }
    }

    async getUserInfo(dni: string): Promise<UserInfo> {
        try {
            const userInfo = await getUserInfo(dni);
            
            if (!userInfo) {
                throw new RpcException({
                    status: 404,
                    message: 'No se pudo obtener la información del DNI proporcionado'
                });
            }

            return userInfo;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException({
                status: 500,
                message: `Error al obtener información del usuario: ${error.message || 'Error desconocido'}`
            });
        }
    }

    async getUserById(userId: string) {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('id, dni, email, nombres, apellidos, created_at, updated_at')
                .eq('id', userId)
                .single();

            if (error || !user) {
                throw new RpcException({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
            }

            return {
                success: true,
                user: user
            };

        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException({
                status: 500,
                message: `Error al obtener el usuario: ${error.message || 'Error desconocido'}`
            });
        }
    }
}