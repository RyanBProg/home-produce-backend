import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('producers/sign-up')
  createProducer() {
    return 'sign-up';
  }

  @Post('login')
  login() {
    return 'login';
  }

  @Post('logout')
  logout() {
    return 'logout';
  }
}
