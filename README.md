# Back-End LionBook - Sistema de Gestão de Acervo

API RESTful para o sistema de gestão de acervo da biblioteca LionBook, desenvolvida em Node.js com Express e Prisma ORM.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **MySQL** - Sistema de gerenciamento de banco de dados
- **CORS** - Controle de acesso entre origens
- **Body-Parser** - Middleware para parsing de requisições

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL Server
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install express --save
npm install cors --save
npm install body-parser --save
npm install prisma --save
npm install @prisma/client --save
```

3. Configure o arquivo `.env` com suas credenciais do banco:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/db_lionbooks"
```

4. Execute o script SQL para criar o banco:
```bash
mysql -u root -p < database/scriptSQL.sql
```

5. Inicie o servidor:
```bash
node app.js
```

A API estará disponível em: `http://localhost:8080`

## 📚 Endpoints da API

### Status da API
- **GET** `/v1/lionbook/status` - Verifica se a API está funcionando

### Livros
- **GET** `/v1/lionbook/livros` - Lista todos os livros
- **GET** `/v1/lionbook/livro/:id` - Busca livro por ID
- **GET** `/v1/lionbook/livros/buscar/:titulo` - Busca livros por título
- **POST** `/v1/lionbook/livro` - Cadastra novo livro
- **PUT** `/v1/lionbook/livro/:id` - Atualiza livro
- **DELETE** `/v1/lionbook/livro/:id` - Remove livro

### Movimentações
- **GET** `/v1/lionbook/movimentacoes` - Lista todas as movimentações  
- **GET** `/v1/lionbook/movimentacao/:id` - Busca movimentação por ID
- **GET** `/v1/lionbook/movimentacoes/livro/:id` - Lista movimentações de um livro
- **POST** `/v1/lionbook/movimentacao` - Registra nova movimentação
- **GET** `/v1/lionbook/tipos-movimentacao` - Lista tipos de movimentação

### Usuários
- **POST** `/v1/lionbook/login` - Autentica usuário (login)
- **POST** `/v1/lionbook/usuario` - Cadastra novo usuário (via Postman)
- **GET** `/v1/lionbook/usuarios` - Lista todos os usuários
- **GET** `/v1/lionbook/usuario/:id` - Busca usuário por ID

## 📝 Exemplos de Uso

### Cadastrar um livro
```json
POST /v1/lionbook/livro
Content-Type: application/json

{
  "titulo": "Clean Code",
  "data_publicacao": "2008-08-01",
  "quantidade": 5,
  "isbn": "978-0132350884"
}
```

### Registrar entrada de livros
```json
POST /v1/lionbook/movimentacao
Content-Type: application/json

{
  "id_movimentacao": 1,
  "id_usuario": 1,
  "quantidade": 3,
  "data_movimentacao": "2025-10-30",
  "id_livro": 1
}
```

### Registrar saída de livros
```json
POST /v1/lionbook/movimentacao
Content-Type: application/json

{
  "id_movimentacao": 2,
  "id_usuario": 1,
  "quantidade": 2,
  "data_movimentacao": "2025-10-30",
  "id_livro": 1
}
```

### Fazer login
```json
POST /v1/lionbook/login
Content-Type: application/json

{
  "login": "admin",
  "senha": "admin123"
}
```

### Cadastrar usuário (via Postman)
```json
POST /v1/lionbook/usuario
Content-Type: application/json

{
  "login": "bibliotecario2",
  "senha": "minhasenha123"
}
```

## 🏗️ Estrutura do Projeto

```
├── controller/
│   ├── livro/
│   │   └── controllerLivro.js
│   ├── movimentacao/
│   │   └── controllerMovimentacao.js
│   └── usuario/
│       └── controllerUsuario.js
├── model/
│   └── DAO/
│       ├── livro.js
│       ├── movimentacao.js
│       └── usuario.js
├── modulo/
│   └── config.js
├── database/
│   └── scriptSQL.sql
├── prisma/
│   └── schema.prisma
├── app.js
└── package.json
```

## 🔍 Códigos de Status HTTP

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos ou campos obrigatórios não preenchidos
- **404** - Recurso não encontrado
- **415** - Tipo de conteúdo não suportado
- **500** - Erro interno do servidor

## 👥 Tipos de Movimentação

- **1** - Entrada (adiciona ao estoque)
- **2** - Saída (remove do estoque)

## 🛡️ Validações Implementadas

- Validação de campos obrigatórios
- Verificação de tipos de dados
- Controle de estoque (não permite saída maior que quantidade disponível)
- Validação de IDs existentes antes de operações

---

**Sistema LionBook v1.0** - Desenvolvido para gestão eficiente de acervos bibliotecários

**Autor:** Gustavo Rocha
