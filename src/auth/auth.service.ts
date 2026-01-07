import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    
    if (user?.password !== pass) {
      throw new UnauthorizedException('E-posta veya şifre hatalı!');
    }

    // Payload içinde 'sub' olarak ID zaten var ama frontend'e açıkça 'id' yollamalıyız
    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      id: user.id, // KRİTİK EKSİK BURASIYDI: Frontend bu 'id'yi bekliyor
      role: user.role,
      email: user.email,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(email: string, pass: string, role: string): Promise<any> {
    return await this.userService.create({
      email: email,
      password: pass,
      role: role
    });
  }
}