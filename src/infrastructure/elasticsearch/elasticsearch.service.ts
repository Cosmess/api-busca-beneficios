import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService {
  constructor(private readonly esService: ElasticsearchService) {}

  async indexCPF(cpf: string, data: any): Promise<void> {
    try {
        await this.esService.index({
            index: 'cpf-benefits',
            id: cpf,
            body: data,
          });
    } catch (error) {
        console.log(error)
    }
  }

  async searchCPF(_id: string): Promise<any[]> {
    try {
      const result = await this.esService.search({
        index: 'cpf-benefits',
        body: {
          query: {
            match: { _id },
          }
        },
      });
  
      return result.hits.hits.map((hit: any) => hit._source);
    } catch (e) {
      console.error('Erro ao buscar documentos:', e.message);
      return [];
    }
  }
  
}
