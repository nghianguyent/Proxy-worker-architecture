import { IsEmail, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(24)
  name: string;

  email: string;

  @IsString()
  // @MinLength(8)
  password: string;

  @IsNumber()
  age?: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  // @MinLength(8)
  password: string;
}
