import { Test, TestingModule } from '@nestjs/testing';
import { ConsultBenefitsUseCase } from '../../src/application/usecases/consult-benefits.usecase';
import { RedisService } from '../../src/infrastructure/redis/redis.service';
import { ElasticService } from '../../src/infrastructure/elasticsearch/elasticsearch.service';
import axios from 'axios';
import * as https from 'https';

jest.mock('axios');

describe('ConsultBenefitsUseCase', () => {
  let consultBenefitsUseCase: ConsultBenefitsUseCase;
  let mockRedisService: Partial<RedisService>;
  let mockElasticService: Partial<ElasticService>;

  beforeEach(async () => {
    mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockElasticService = {
      indexCPF: jest.fn(),
      searchCPF: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultBenefitsUseCase,
        { provide: RedisService, useValue: mockRedisService },
        { provide: ElasticService, useValue: mockElasticService },
      ],
    }).compile();

    consultBenefitsUseCase = module.get<ConsultBenefitsUseCase>(ConsultBenefitsUseCase);
  });

  describe('getToken', () => {
    it('deve obter um token com sucesso', async () => {
      const mockTokenResponse = {
        data: {
          data: {
            token: 'mock-token',
          },
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockTokenResponse);

      const tokenResponse = await consultBenefitsUseCase.getToken();

      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.BASE_URL}/api/v1/token`,
        { username: process.env.APPUSERNAME, password: process.env.PASSWORD },
        { httpsAgent: expect.any(https.Agent) },
      );

      expect(process.env.TOKEN).toBe('mock-token');
      expect(tokenResponse).toEqual(mockTokenResponse.data);
    });
  });

  describe('execute', () => {
    it('deve retornar dados do cache se existirem', async () => {
      const mockCPF = '12345678900';
      const mockBenefits = { data: { beneficios: [{ id: 1, name: 'Benefit 1' }] } };
      (mockRedisService.get as jest.Mock).mockResolvedValue(JSON.stringify(mockBenefits));

      const result = await consultBenefitsUseCase.execute(mockCPF);

      expect(mockRedisService.get).toHaveBeenCalledWith(mockCPF);
      expect(result).toEqual(mockBenefits);
    });

    it('deve buscar dados, salvar no cache e indexar no Elasticsearch se não estiver no cache', async () => {
      const mockCPF = '12345678900';
      const mockResponse = {
        data: {
          data: { beneficios: [{ id: 1, name: 'Benefit 1' }] },
        },
      };

      (mockRedisService.get as jest.Mock).mockResolvedValue(null);
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await consultBenefitsUseCase.execute(mockCPF);

      expect(mockRedisService.get).toHaveBeenCalledWith(mockCPF);
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.BASE_URL}/api/v1/inss/consulta-beneficios`,
        {
          params: { cpf: mockCPF },
          headers: { Authorization: `Bearer ${process.env.TOKEN}` },
          httpsAgent: expect.any(https.Agent),
        },
      );

      expect(mockRedisService.set).toHaveBeenCalledWith(
        mockCPF,
        JSON.stringify(mockResponse.data.data),
        3600,
      );

      expect(mockElasticService.indexCPF).toHaveBeenCalledWith(
        mockCPF,
        mockResponse.data.data,
      );

      expect(result).toEqual(mockResponse.data.data);
    });

    it('deve retornar mensagem de erro se a consulta falhar', async () => {
      const mockCPF = '12345678900';
      const mockErrorResponse = {
        response: {
          data: 'Erro ao consultar benefícios',
        },
      };

      (mockRedisService.get as jest.Mock).mockResolvedValue(null);
      (axios.get as jest.Mock).mockRejectedValue(mockErrorResponse);

      const result = await consultBenefitsUseCase.execute(mockCPF);

      expect(mockRedisService.get).toHaveBeenCalledWith(mockCPF);
      expect(result).toEqual({
        message: 'Erro ao consultar benefícios: status Erro ao consultar benefícios',
      });
    });
  });
});
