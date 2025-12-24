import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Repositories } from 'src/common/enum/providers.enum';
import { TTokenPayload } from 'src/types/token-payload';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateUserDto, LoginDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(Repositories.USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  getTokenFromCookies(cookies: Record<string, string>) {
    return cookies['access_token'];
  }

  generateToken(user: User) {
    const payload: Pick<TTokenPayload, 'email'> = {
      email: user.email,
    };

    const token = this.jwtService.sign(payload, {
      subject: user.id,
    });

    return token;
  }

  async register(userData: CreateUserDto) {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async login(data: LoginDto, res: Response) {
    const user = await this.userRepository.findOne({
      where: {
        email: data.email,
        password: data.password,
      },
    });

    if (!user) {
      throw new NotFoundException('Cannot find user');
    }

    const token = this.generateToken(user);

    res.cookie('access_token', token, {
      expires: new Date(Date.now() + 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      signed: true,
    });

    return res.json({
      accessToken: token,
    });
  }

  logout(req: Request, res: Response) {
    const token = this.getTokenFromCookies(req.cookies);

    return res.json({ message: 'Logged out successfully' });
  }
}
