import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @MaxLength(24)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  // @MinLength(8)
  password: string;
}

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  // @MinLength(8)
  password: string;
}
