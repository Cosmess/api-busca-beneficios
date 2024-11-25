import { Test, TestingModule } from '@nestjs/testing';
import { ElasticService } from '../infrastructure/elasticsearch/elasticsearch.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

describe('ElasticService', () => {
  let elasticService: ElasticService;
  let mockElasticsearchService: Partial<ElasticsearchService>;

  beforeEach(async () => {
    mockElasticsearchService = {
      index: jest.fn().mockResolvedValue({}),
      search: jest.fn().mockResolvedValue({
        hits: {
          hits: [
            {
              _source: {
                cpf: '34322835040',
                beneficios: [
                  {
                    numero_beneficio: '1794290989',
                    codigo_tipo_beneficio: '01',
                  },
                ],
              },
            },
          ],
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticService,
        { provide: ElasticsearchService, useValue: mockElasticsearchService },
      ],
    }).compile();

    elasticService = module.get<ElasticService>(ElasticService);
  });

  it('deve chamar o índice com parâmetros corretos', async () => {
    const mockCPF = '343.228.350-40';
    const mockData = {
      cpf: '34322835040',
      beneficios: [
        {
          numero_beneficio: '1794290989',
          codigo_tipo_beneficio: '01',
        },
      ],
    };

    await elasticService.indexCPF(mockCPF, mockData);

    expect(mockElasticsearchService.index).toHaveBeenCalledWith({
      index: 'cpf-benefits',
      id: mockCPF,
      body: mockData,
    });
  });

  it('deve buscar corretamente os dados pelo CPF', async () => {
    const mockCPF = '34322835040';

    const result = await elasticService.searchCPF(mockCPF);

    expect(result).toEqual([
      {
        cpf: '34322835040',
        beneficios: [
          {
            numero_beneficio: '1794290989',
            codigo_tipo_beneficio: '01',
          },
        ],
      },
    ]);
  });
});
