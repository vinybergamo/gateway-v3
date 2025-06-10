import { IsDocument } from '@/helpers/validators/is-document';
import { IsPhone } from '@/helpers/validators/is-phone';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john_doe@email.com',
  })
  @IsEmail()
  email: string;

  @IsDocument()
  @Transform(({ value }) => value.replace(/\D/g, ''))
  @ApiProperty({
    description: 'Document of the customer',
    example: '12345678909',
    required: true,
  })
  document: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+5511999999999',
  })
  @IsString()
  @Transform(({ value }) => {
    const sanitizedValue = value.replace(/\D/g, '');
    return `+${sanitizedValue}`;
  })
  @IsPhone()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
  })
  @IsString()
  password: string;
}
