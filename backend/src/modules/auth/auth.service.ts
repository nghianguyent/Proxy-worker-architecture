import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { generateKey } from 'crypto';
import { Response } from 'express';
import { uuidv7 } from 'uuidv7';
import { Repositories } from 'src/common/enum/providers.enum';
import { User } from 'src/modules/user/entity/user.entity';
import { CreateUserDTO, LoginDTO } from 'src/modules/user/dto/user.dto';
import { TTokenPayload } from 'src/types/token-payload';
import { Repository } from 'typeorm';

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

  async register(userData: CreateUserDTO) {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async login(data: LoginDTO, res: Response) {
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
      encode(val) {
        return val;
      },
    });
    return res.json({
      accessToken: token,
    });
  }
}
