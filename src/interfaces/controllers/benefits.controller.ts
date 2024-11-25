import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RabbitMQService } from '../../infrastructure/rabbitmq/rabbitmq.service';
import { ConsultBenefitsUseCase } from '../../application/usecases/consult-benefits.usecase';
import axios from 'axios';
import * as https from 'https';
import { CPFDto } from '../dtos/cpfDto';


@ApiTags('Benefícios')
@Controller('api/v1')
export class BenefitsController {
  constructor(
    private readonly consultBenefitsUseCase: ConsultBenefitsUseCase,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @ApiOperation({ summary: 'Consultar Benefícios' })
  @ApiResponse({ status: 200, description: 'Dados de benefícios retornados com sucesso' })
  @Get('inss/consulta-beneficios')
  async consultBenefits(@Query('cpf') cpf: string): Promise<any> {
    return this.consultBenefitsUseCase.search(cpf);

  }

  @ApiOperation({ summary: 'Adicionar CPFs na Fila' })
  @ApiResponse({ status: 201, description: 'CPFs adicionados na fila com sucesso' })
  @ApiBody({
    description: 'Lista de CPFs a serem adicionados à fila',
    type: [CPFDto],
  })
  @Post('queue')
  async addToQueue(@Body() body: CPFDto[]): Promise<void> {
    for (const item of body) {
      await this.rabbitMQService.sendToQueue(process.env.QUEUE, item.cpf);
    }
    console.log(`CPFs adicionados à fila: ${body.map((item) => item.cpf).join(', ')}`);
  }
}
