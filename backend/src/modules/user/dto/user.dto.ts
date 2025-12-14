import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @MaxLength(24)
  name: string;

  email: string;

  @IsString()
  // @MinLength(8)
  password: string;

  age?: number;
}

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  // @MinLength(8)
  password: string;
}
