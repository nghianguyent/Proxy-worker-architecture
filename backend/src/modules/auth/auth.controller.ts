import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import type { Response } from 'express';
import { CreateUserDto, LoginDto } from '../user/dto/create-user.dto';

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

  // @Post("logout")
  // logout(@Req() req: Request, @Res() res: Response) {
  // 	return this.authService.logout(req, res);
  // }
  //  }
}
