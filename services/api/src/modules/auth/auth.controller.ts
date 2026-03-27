import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { AuthService, RegisterUserInput } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterUserInput) {
    return this.authService.register(body);
  }

  @Get('users/:userId')
  findById(@Param('userId') userId: string) {
    return this.authService.findById(userId);
  }
}
