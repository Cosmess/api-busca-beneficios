
# API Dados Benefícios

Uma API desenvolvida com **NestJS** para consultas de benefícios, com integração ao Redis, Elasticsearch e RabbitMQ, utilizando **Docker Compose** para facilitar a configuração e execução dos serviços.

---

## 🚀 Funcionalidades

- Consulta de benefícios pelo CPF.
- Armazenamento de dados no Redis para cache.
- Indexação e busca de dados no Elasticsearch.
- Utilização de fila RabbitMQ para processamento assíncrono.

---

## 🛠️ Tecnologias Utilizadas

- **NestJS**
- **Redis**
- **Elasticsearch**
- **RabbitMQ**
- **Docker e Docker Compose**

---

## 📋 Pré-requisitos

Certifique-se de ter os seguintes itens instalados na sua máquina:

- **Node.js** (v16+)
- **npm** ou **yarn**
- **Docker** (v20+) e **Docker Compose**

---

## 📂 Como Instalar o Projeto

### 1. Clone o Repositório
```bash
git clone https://github.com/Cosmess/api-busca-beneficios.git
cd api-dados-beneficios
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

```env
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
REDIS_URL=redis://redis:6379
ELASTICSEARCH_NODE=http://elasticsearch:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=JfoSi0+MUSgZK+Do2ER6
BASE_URL=######
APPUSERNAME=#####
PASSWORD=####
QUEUE=cpfQueue
```

**Explicação das Variáveis:**
- **`RABBITMQ_URL`**: URL de conexão ao RabbitMQ.
- **`REDIS_URL`**: URL de conexão ao Redis.
- **`ELASTICSEARCH_NODE`**: URL do nó do Elasticsearch.
- **`ELASTICSEARCH_USERNAME`** e **`ELASTICSEARCH_PASSWORD`**: Credenciais do Elasticsearch.
- **`BASE_URL`**: URL base para consulta de dados externos.
- **`APPUSERNAME`** e **`PASSWORD`**: Credenciais para autenticação na API externa.
- **`QUEUE`**: Nome da fila RabbitMQ usada para processamento.

---

## ▶️ Como Rodar o Projeto

### 1. Subir os Serviços com Docker Compose
Certifique-se de que o Docker está rodando e execute:

```bash
docker-compose up --build
```

### 2. Acessar a API
Acesse a API no navegador ou em uma ferramenta como Postman:

- **URL Base com a pagina de busca:** [http://localhost:3000](http://localhost:3000)
- - **URL Swagger:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### 3. Verificar o Status dos Serviços
Você pode verificar o status dos serviços individualmente:

- **Redis:**
  ```bash
  redis-cli -h localhost -p 6379 ping
  ```
  Resposta esperada: `PONG`

- **Elasticsearch:**
  ```bash
  curl -u elastic:JfoSi0+MUSgZK+Do2ER6 http://localhost:9200
  ```
  Resposta esperada: JSON com informações do cluster.

- **RabbitMQ (Interface de Gerenciamento):**
  Acesse [http://localhost:15672](http://localhost:15672) no navegador.  
  - **Usuário:** `guest`
  - **Senha:** `guest`

---

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura modular com camadas distintas para responsabilidades específicas:

```
src/
├── application/         # Casos de uso e lógica de aplicação
├── infrastructure/      # Serviços de infraestrutura (Redis, Elasticsearch, RabbitMQ)
├── interfaces/          # Controllers e DTOs
├── main.ts              # Arquivo principal do aplicativo
tests/                   # Testes unitários
.env                     # Arquivo de variáveis de ambiente
```

---

## 🧪 Como Rodar os Testes

### Rodar Todos os Testes
```bash
npm run test
```

### Rodar um Arquivo de Teste Específico
```bash
npx jest tests/nome-do-teste.spec.ts
```

---

## 🐳 Docker Compose

### Serviços:

1. **NestJS App**: A aplicação principal.
2. **Redis**: Cache de dados.
3. **Elasticsearch**: Busca e indexação de documentos.
4. **RabbitMQ**: Gerenciador de filas.

### Subir os Serviços:
```bash
docker-compose up --build
```

---
