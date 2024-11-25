import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { RedisService } from './infrastructure/redis/redis.service';
import { CPFQueueProcessor } from './interfaces/controllers/cpf-queue.processor';
import { RabbitMQService } from './infrastructure/rabbitmq/rabbitmq.service';
import { ConsultBenefitsUseCase } from './application/usecases/consult-benefits.usecase';
import { ElasticService } from './infrastructure/elasticsearch/elasticsearch.service';
import { BenefitsController } from './interfaces/controllers/benefits.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [BenefitsController],
  providers: [
    RedisService,
    RabbitMQService,
    ConsultBenefitsUseCase,
    CPFQueueProcessor,
    ElasticService,
  ],
  exports: [
    RedisService,
    CPFQueueProcessor,
    ConsultBenefitsUseCase,
    ElasticService,
  ],
})
export class AppModule {}
