import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { TUser } from 'src/modules/user/entities/user.entity';

export const User = createParamDecorator((_, ctx) => {
  const request = ctx.switchToHttp().getRequest<
    Request & {
      user: TUser;
    }
  >();

  return request.user;
});
