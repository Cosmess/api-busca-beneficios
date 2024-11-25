import { Injectable } from '@nestjs/common';
import { ElasticService } from '../../infrastructure/elasticsearch/elasticsearch.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import axios from 'axios';
import * as https from 'https';

@Injectable()
export class ConsultBenefitsUseCase {
  constructor(
    private readonly redisService: RedisService,
    private readonly elasticService: ElasticService,
  ) {}

  async execute(cpf: string): Promise<any> {
    try {
    await this.getToken();
    const cachedData = await this.redisService.get(cpf);
    if (cachedData) {
      console.log(`${cpf} processado.`)
      return JSON.parse(cachedData);
    }

      const httpsAgent = new https.Agent({ rejectUnauthorized: false });
      const response = await axios.get(`${process.env.BASE_URL}/api/v1/inss/consulta-beneficios`, {
        params: { cpf },
        headers: { Authorization: `Bearer ${process.env.TOKEN}` },
        httpsAgent 
      });

      const benefits = response.data.data;
      await this.redisService.set(cpf, JSON.stringify(benefits), 3600);
      await this.elasticService.indexCPF(cpf,benefits);
      console.log(`${cpf} processado.`)
      return benefits;
    } catch (error) {
      return {
        message: `Erro ao consultar benefícios: status ${error.response.data}`,
      };
    } 
  }

 async  getToken(){
    const body = { username: process.env.APPUSERNAME , password: process.env.PASSWORD }
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.post(`${process.env.BASE_URL}/api/v1/token`, body,{ httpsAgent });
    process.env.TOKEN = response.data.data.token;
    return response.data;
  }

  async search(cpf: string) : Promise<any>{
    return await this.elasticService.searchCPF(cpf);
  }
}
