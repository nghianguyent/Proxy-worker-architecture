import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TTokenPayload } from 'src/types/token-payload';
import { Inject, Injectable } from '@nestjs/common';
import { Repositories } from 'src/common/enum/providers.enum';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    @Inject(Repositories.USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: (request: Request) => {
        console.log('jwtFromRequest', request.cookies);
        return (request.signedCookies as Record<string, string>)[
          'access_token'
        ];
      },
      ignoreExpiration: false,
      secretOrKey: config.get<string>('TOKEN_SECRET'),
    });
  }
  // ... validate logic
  async validate(req: Request, payload: TTokenPayload) {
    const user = await this.userRepository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (user) {
      return true;
    }

    return false;
    // const { id, email } = payload;
    // const user = await this.userService.findOne(id);
    // if (!user) {
    //   throw new UnauthorizedException('Invalid token');
    // }
    // return user;
  }
}
