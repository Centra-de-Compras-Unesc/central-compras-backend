# Central de Compras - Backend

API REST para gerenciamento de pedidos, fornecedores, lojas e cashback. Construído com Node.js, Express e PostgreSQL.

## 🚀 Características

- **API RESTful Completa**: CRUD para pedidos, lojas, fornecedores, produtos
- **Autenticação JWT**: Segurança com tokens JWT
- **Prisma ORM**: Acesso seguro ao banco de dados
- **Validação de Dados**: Schemas com Zod
- **Seed Data**: Script para popular banco com dados históricos
- **BigInt Support**: Suporte para números grandes
- **Relacionamentos**: Associações complexas entre entidades
- **Middleware Customizado**: Auth, error handling, JSON BigInt

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn
- PostgreSQL 12+
- Git

## 🔧 Instalação

```bash
cd backend
npm install
```

## ⚙️ Configuração

1. **Crie um arquivo `.env`** na raiz do backend:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_interdisciplinar"
JWT_SECRET="sua_chave_secreta_super_segura"
NODE_ENV="development"
PORT=3000
```

2. **Execute as migrations do Prisma:**

```bash
npx prisma migrate deploy
```

3. **(Opcional) Execute o seed:**

```bash
node scripts/seedHistoricoVendas.js
```

## 🏃 Executar

**Modo Desenvolvimento:**

```bash
npm run dev
```

Servidor rodará em `http://localhost:3000`

**Modo Produção:**

```bash
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── controllers/        # Lógica de negócio
│   ├── authController.js
│   ├── pedidoController.js
│   ├── lojaController.js
│   ├── fornecedorController.js
│   └── ...
├── routes/             # Definição de rotas
│   ├── auth.js
│   ├── pedidos.js
│   ├── lojas.js
│   └── ...
├── middlewares/        # Middlewares customizados
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── jsonBigIntMiddleware.js
├── schemas/            # Validações com Zod
│   └── condicaoSchema.js
├── utils/              # Funções utilitárias
│   └── serializers.js
└── server.js           # Entrada principal

prisma/
├── schema.prisma       # Schema do banco
└── migrations/         # Histórico de migrations

scripts/
├── seedHistoricoVendas.js    # Seed com 1095 pedidos
└── dados_inicializacao.sql   # Script SQL completo
```

## 📊 Banco de Dados

### Tabelas Principais

| Tabela                   | Descrição                 |
| ------------------------ | ------------------------- |
| `tb_sistema_conta`       | Contas/empresas           |
| `tb_sistema_usuario`     | Usuários do sistema       |
| `tb_loja`                | Lojas (lojistas)          |
| `tb_fornecedor`          | Fornecedores              |
| `tb_fornecedor_produto`  | Produtos dos fornecedores |
| `tb_pedido`              | Pedidos de compra         |
| `tb_pedido_item`         | Itens de cada pedido      |
| `tb_loja_cashback`       | Cashback acumulado        |
| `tb_fornecedor_campanha` | Campanhas promocionais    |

### Relacionamentos

```
tb_sistema_usuario
├── tb_loja (1:N)
├── tb_fornecedor (1:N)
└── tb_pedido (1:N)

tb_loja
├── tb_pedido (1:N)
└── tb_loja_cashback (1:N)

tb_fornecedor
├── tb_fornecedor_produto (1:N)
├── tb_fornecedor_campanha (1:N)
├── tb_pedido (1:N)
└── tb_fornecedor_condicao (1:N)

tb_pedido
└── tb_pedido_item (1:N)
```

## 🔐 Autenticação

Sistema JWT com roles (ADMIN, LOJISTA, FORNECEDOR):

```bash
# Login
POST /auth/login
{
  "email": "user@example.com",
  "senha": "password"
}

# Resposta
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

Token é validado em todas as rotas protegidas via `authMiddleware`.

## 📡 Endpoints Principais

### Autenticação

- `POST /auth/login` - Login
- `GET /auth/me` - Perfil atual

### Pedidos

- `GET /pedidos` - Listar todos (sem limite)
- `GET /pedidos/:id` - Detalhe
- `POST /pedidos` - Criar
- `PUT /pedidos/:id` - Atualizar
- `PATCH /pedidos/:id` - Atualizar status
- `DELETE /pedidos/:id` - Deletar

### Lojas

- `GET /lojas` - Listar
- `GET /lojas/:id` - Detalhe
- `POST /lojas` - Criar
- `PUT /lojas/:id` - Atualizar

### Fornecedores

- `GET /fornecedores` - Listar
- `GET /fornecedores/:id` - Detalhe
- `POST /fornecedores` - Criar
- `PUT /fornecedores/:id` - Atualizar

### Produtos

- `GET /produtos` - Listar
- `POST /produtos` - Criar
- `PUT /produtos/:id` - Atualizar

### Campanhas

- `GET /campanhas` - Listar
- `POST /campanhas` - Criar
- `PUT /campanhas/:id` - Atualizar

## 🌱 Seed Data

### seedHistoricoVendas.js

Popula 1268 pedidos em 365 dias:

- **Quantidade:** 3 pedidos/dia
- **Valores:** R$ 50 - R$ 800
- **Distribuição:** Aleatória entre lojas e fornecedores
- **Status:** Aleatório (Pendente, Aprovado, Faturado, Entregue)

Executar:

```bash
node scripts/seedHistoricoVendas.js
```

### dados_inicializacao.sql

Script SQL completo com:

- 2 contas
- 10 usuários (5 lojistas + 5 fornecedores)
- 5 lojas
- 5 fornecedores
- 10 produtos
- Condições comerciais
- 8 pedidos de exemplo

Executar:

```bash
psql -U usuario -d db_interdisciplinar -f scripts/dados_inicializacao.sql
```

## 🔍 Validações

### Zod Schemas

- `condicaoSchema.js` - Validação de condições comerciais

Exemplo:

```javascript
const condicaoSchema = z.object({
  pedido_minimo: z.number().positive(),
  percentual_cashback: z.number().min(0).max(100),
  estado: z.string().length(2).optional(),
});
```

## 📝 Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/db_interdisciplinar"

# Autenticação
JWT_SECRET="sua_chave_secreta_super_segura"

# Aplicação
NODE_ENV="development"  # development | production
PORT=3000
```

## 🐛 Troubleshooting

**Erro de conexão ao banco?**

- Verifique se PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Execute: `psql -U user -d db_name -c "SELECT 1"`

**Erro 401 Não Autorizado?**

- Token JWT inválido ou expirado
- Faça login novamente para obter novo token

**Erro ao fazer seed?**

- Verifique se o banco está criado
- Execute migrations: `npx prisma migrate deploy`
- Verifique a quantidade de lojas/fornecedores no banco

**Erro BigInt?**

- Use `jsonBigIntMiddleware` para serialização
- Números grandes são automaticamente convertidos

## 🚀 Deploy

### Heroku

```bash
heroku login
heroku create seu-app
heroku config:set DATABASE_URL="..."
git push heroku main
```

### Railway

```bash
npm install -g railway
railway init
railway up
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Documentação Prisma

Para gerar documentação do schema:

```bash
npx prisma studio
```

Acesse `http://localhost:5555` para gerenciar dados visualmente.

## 🔗 Prisma Client

Regenerar Prisma Client após mudanças no schema:

```bash
npx prisma generate
```

**Última atualização:** 28 de Novembro de 2025

## Trabalho desenvolvido por:

Gustavo da Cunha Constante,
Eduardo Assis,
João Marcos Vieira dos Santos,
Henrique Matiola,
Bruno Luque,
Brayan Miguel Favarin.
