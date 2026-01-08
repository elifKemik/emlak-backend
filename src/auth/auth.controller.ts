import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: any) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  
  @Post('register')
  async register(@Body() registerDto: any) {
    
    return this.authService.register(
      registerDto.email, 
      registerDto.password, 
      registerDto.role
    );
  }
}