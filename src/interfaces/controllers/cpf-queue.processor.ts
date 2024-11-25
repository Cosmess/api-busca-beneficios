import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../../infrastructure/rabbitmq/rabbitmq.service';
import { ConsultBenefitsUseCase } from 'src/application/usecases/consult-benefits.usecase';

@Injectable()
export class CPFQueueProcessor {
  constructor(private readonly rabbitMQService: RabbitMQService,
    private readonly consultBenefitsUseCase: ConsultBenefitsUseCase,
  ) {}

  async processQueue(): Promise<void> {
    await this.rabbitMQService.consume(process.env.QUEUE, async (cpf: string) => {
      console.log(`processando CPF: ${cpf}`);
      this.consultBenefitsUseCase.execute(cpf);
    });
  }
}
