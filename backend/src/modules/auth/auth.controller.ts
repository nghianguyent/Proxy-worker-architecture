import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import type { Response } from 'express';
import { CreateUserDto, LoginDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    //    @Post("refresh-tokens")
    // refreshTokens(@Req() req: Request, @Res() res: Response) {
    // 	return this.authService.refreshTokens(req, res);
    // }
  }

  @Public()
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  login(@Body() data: LoginDto, @Res() res: Response) {
    const token = this.authService.login(data, res);
    return token;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req, @Res() res: Response) {
    return this.authService.logout(req, res);
  }
}
