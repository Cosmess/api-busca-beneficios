import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CPFDto {
  @ApiProperty({
    example: '12345678900',
    description: 'Número do CPF (apenas números)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'O CPF deve conter exatamente 11 dígitos.' })
  cpf: string;
}
