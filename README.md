# 🚀 Central de Compras - Backend

API REST para gerenciamento de pedidos, fornecedores, lojas e cashback. Construído com **Node.js + Express + Prisma + PostgreSQL**.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** - [Download](https://nodejs.org)
- **npm** ou **yarn** (vem com Node.js)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org)
- **Git** - [Download](https://git-scm.com)

---

## 🔧 Instalação Passo a Passo

### 1️⃣ Crie o banco de dados

```bash
createdb db_interdisciplinar
```

Se usou senha no PostgreSQL:

```bash
createdb -U postgres db_interdisciplinar
```

### 2️⃣ Configure as variáveis de ambiente

**Crie o arquivo `backend/.env`:**

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/db_interdisciplinar?schema=public"
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
NODE_ENV="development"
PORT=3000
```

**⚠️ Importante:** Atualize o `DATABASE_URL` com suas credenciais do PostgreSQL.

### 3️⃣ Instale as dependências

```bash
npm install
```

### 4️⃣ Execute as migrations

```bash
npx prisma migrate deploy
```

### 5️⃣ Inicie o servidor

```bash
npm run dev
```

✅ Backend rodará em `http://localhost:3000`

---

## 🛠️ Comandos Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start

# Gerar/Atualizar Prisma Client
npx prisma generate

# Abrir Prisma Studio (GUI para banco de dados)
npx prisma studio

# Ver status das migrations
npx prisma migrate status

# Resetar banco de dados (CUIDADO!)
npx prisma migrate reset

# Ver logs do banco
npm run logs
```

---

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/          # Lógica de negócio
│   │   ├── authController.js
│   │   ├── lojaController.js
│   │   ├── fornecedorController.js
│   │   ├── produtoController.js
│   │   ├── pedidoController.js
│   │   ├── campanhaController.js
│   │   ├── usuarioController.js
│   │   └── ...
│   ├── routes/               # Definição de rotas/endpoints
│   │   ├── auth.js
│   │   ├── lojas.js
│   │   ├── fornecedores.js
│   │   ├── produtos.js
│   │   ├── pedidos.js
│   │   ├── campanhas.js
│   │   ├── usuarios.js
│   │   ├── cashback.js
│   │   └── ...
│   ├── middlewares/          # Middlewares customizados
│   │   ├── authMiddleware.js     # Validação JWT
│   │   ├── errorHandler.js       # Tratamento de erros
│   │   ├── jsonBigIntMiddleware.js # Suporte a números grandes
│   │   └── validateFornecedor.js # Validações específicas
│   ├── schemas/              # Validações com Zod
│   │   └── condicaoSchema.js
│   ├── utils/                # Funções utilitárias
│   │   └── serializers.js
│   ├── scripts/              # Scripts úteis
│   │   ├── hashPasswords.js
│   │   └── ...
│   ├── generated/            # Gerado automaticamente (Prisma)
│   │   └── prisma/
│   │       ├── client.js
│   │       └── schema.prisma
│   └── server.js             # Arquivo principal
├── prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   └── migrations/           # Histórico de migrations
├── .env                      # Variáveis de ambiente
├── package.json
└── README.md
```

---

## 📊 Banco de Dados

### Tabelas Principais

| Tabela                   | Descrição                             |
| ------------------------ | ------------------------------------- |
| `tb_sistema_conta`       | Contas/empresas no sistema            |
| `tb_sistema_usuario`     | Usuários (Admin, Fornecedor, Lojista) |
| `tb_loja`                | Lojas cadastradas                     |
| `tb_fornecedor`          | Fornecedores cadastrados              |
| `tb_fornecedor_produto`  | Produtos dos fornecedores             |
| `tb_pedido`              | Pedidos de compra                     |
| `tb_pedido_item`         | Itens dentro de cada pedido           |
| `tb_loja_cashback`       | Cashback acumulado por loja           |
| `tb_fornecedor_campanha` | Campanhas/promoções                   |

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

tb_pedido
└── tb_pedido_item (1:N)
```

---

## 🔐 Autenticação

Sistema JWT com três roles:

### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@teste.com",
  "senha": "123456",
  "id_conta": 1
}
```

**Resposta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id_usuario": 1,
    "email": "admin@teste.com",
    "nome": "Admin",
    "tipo": "ADMIN"
  }
}
```

### Usando o Token

Todas as requisições autenticadas precisam do header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Tipos de Usuário

- **ADMIN** - Gerencia sistema, usuários, lojas, fornecedores
- **FORNECEDOR** - Gerencia produtos, campanhas, vê pedidos
- **LOJISTA** - Faz pedidos, vê cashback, histórico de compras

---

## 📡 API Endpoints

### Autenticação

- `POST /auth/login` - Login

### Usuários

- `GET /usuarios` - Listar todos
- `GET /usuarios/:id` - Detalhe
- `POST /usuarios` - Criar
- `PUT /usuarios/:id` - Atualizar
- `DELETE /usuarios/:id` - Deletar

### Lojas

- `GET /lojas` - Listar
- `GET /lojas/:id` - Detalhe
- `POST /lojas` - Criar
- `PUT /lojas/:id` - Atualizar
- `DELETE /lojas/:id` - Deletar

### Fornecedores

- `GET /fornecedores` - Listar
- `GET /fornecedores/:id` - Detalhe
- `POST /fornecedores` - Criar
- `PUT /fornecedores/:id` - Atualizar
- `DELETE /fornecedores/:id` - Deletar

### Produtos

- `GET /produtos` - Listar
- `GET /produtos/:id` - Detalhe
- `POST /produtos` - Criar
- `PUT /produtos/:id` - Atualizar
- `DELETE /produtos/:id` - Deletar

### Campanhas

- `GET /campanhas` - Listar
- `GET /campanhas/:id` - Detalhe
- `POST /campanhas` - Criar
- `PUT /campanhas/:id` - Atualizar
- `DELETE /campanhas/:id` - Deletar

### Pedidos

- `GET /pedidos` - Listar
- `GET /pedidos/:id` - Detalhe
- `POST /pedidos` - Criar
- `PUT /pedidos/:id` - Atualizar
- `DELETE /pedidos/:id` - Deletar
- `PATCH /pedidos/:id/status` - Atualizar status

### Cashback

- `GET /cashback` - Listar cashback por loja
- `GET /cashback/:lojaId` - Detalhe de uma loja

---

## 🔍 Validações

O backend utiliza **Zod** para validação de schemas:

```javascript
// Exemplo: condicaoSchema.js
const condicaoSchema = z.object({
  pedido_minimo: z.number().positive(),
  percentual_cashback: z.number().min(0).max(100),
  estado: z.string().length(2).optional(),
});
```

Todas as requisições são validadas antes de chegar aos controllers.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js 18+** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação com tokens
- **bcryptjs** - Hash seguro de senhas
- **Zod** - Validação de schemas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **nodemon** - Hot reload em desenvolvimento

---

## 📝 Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL="postgresql://postgres:root@localhost:5432/db_interdisciplinar?schema=public"

# Autenticação
JWT_SECRET="sua_chave_secreta_super_segura"

# Aplicação
NODE_ENV="development"  # development | production
PORT=3000
```

---

## 🐛 Troubleshooting

### ❌ "ERRO: Conexão ao banco de dados recusada"

**Solução:**

1. Verifique se PostgreSQL está rodando
2. Confirme as credenciais no `.env`
3. Teste: `psql -U postgres -d db_interdisciplinar -c "SELECT 1"`

### ❌ "ERRO: Porta 3000 já está em uso"

**Solução:**

```bash
# Encontre o processo
lsof -i :3000

# Mate o processo (macOS/Linux)
kill -9 <PID>

# Ou altere a porta no .env
PORT=3001
```

### ❌ "ERRO: Prisma Client não inicializado"

**Solução:**

```bash
npm install
npx prisma generate
npm run dev
```

### ❌ "ERRO: Migrations pendentes"

**Solução:**

```bash
npx prisma migrate status
npx prisma migrate deploy
```

### ❌ "ERRO: Dados não aparecem no banco"

**Solução:**

1. Confirme que migrations foram executadas
2. Verifique se o banco está correto no `.env`
3. Use `npx prisma studio` para verificar dados visualmente

---

## 💡 Dicas Importantes

### Desenvolvendo Novos Endpoints

1. **Crie a rota** em `src/routes/`
2. **Crie o controller** em `src/controllers/`
3. **Defina o schema de validação** em `src/schemas/`
4. **Registre a rota** em `src/server.js`
5. **Teste com curl ou Postman**

### Adicionando Novos Campos ao Banco

1. **Modifique `prisma/schema.prisma`**
2. **Crie uma migration**: `npx prisma migrate dev --name nome_descritivo`
3. **Regenere o client**: `npx prisma generate`

### Debugging

Use `npx prisma studio` para visualizar/editar dados:

```bash
npx prisma studio
```

Acesse `http://localhost:5555`

---

## 🔒 Segurança

✅ Senhas armazenadas com hash bcrypt (10 rounds)  
✅ Autenticação por JWT em todas as rotas protegidas  
✅ Validação de schemas em todas as requisições  
✅ Middleware de autenticação com erro 401  
✅ CORS configurado para development  
✅ Proteção contra SQL injection (via Prisma)

---

## 📅 Última Atualização

6 de dezembro de 2025

---

## 👥 Contribuidores

Gustavo da Cunha Constante  
Eduardo Assis  
João Marcos Vieira dos Santos  
Henrique Matiola  
Bruno Luque  
Brayan Miguel Favarin

---

## 📞 Suporte

Para problemas com a API, verifique:

1. Se o servidor está rodando: `npm run dev`
2. Se o banco está conectado: `psql -U postgres -d db_interdisciplinar`
3. Se o `.env` está configurado corretamente
4. Se o token JWT está sendo enviado nos headers
