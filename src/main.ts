import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CPFQueueProcessor } from './interfaces/controllers/cpf-queue.processor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API de Dados de Benefícios')
    .setDescription('API para consultar benefícios com RabbitMQ, Redis e Elasticsearch')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const queueProcessor = app.get(CPFQueueProcessor);

  await queueProcessor.processQueue();

  await app.listen(3000);
}
bootstrap();
