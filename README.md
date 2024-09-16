
Sistema de Gestão de Projetos

Este é um sistema de gestão de projetos desenvolvido como parte de um projeto de aprendizado, com funcionalidades que permitem a criação, edição, listagem e exclusão de projetos. O sistema é dividido em dois componentes: um backend que gerencia as operações no banco de dados e autenticação de usuários, e um frontend que oferece uma interface amigável para interação com o sistema.
Funcionalidades Principais

    Cadastro e Autenticação de Usuários: Permite criar uma conta de usuário e realizar login.
    Gerenciamento de Projetos:
    Criar novos projetos.
    Listar todos os projetos cadastrados pelo usuário.
    Atualizar informações dos projetos.
    Excluir projetos.
    Segurança: Autenticação de usuário com JWT para proteger as rotas.

Tecnologias Utilizadas
Backend (API)

    Node.js: Plataforma usada para o desenvolvimento do backend.
    Express.js: Framework usado para facilitar a criação de rotas e o gerenciamento de requisições.
    Prisma ORM: Utilizado para interagir com o banco de dados MySQL.
    JWT (JSON Web Token): Usado para autenticação e autorização.
    bcryptjs: Biblioteca utilizada para hash de senhas.

Frontend

    React.js: Framework usado para construir a interface de usuário.
    Axios: Biblioteca para fazer requisições HTTP para o backend.
    Bulma: Framework CSS usado para estilização do frontend.
    CSS Personalizado: Para estilizações adicionais.

Banco de Dados

    MySQL: Sistema de gerenciamento de banco de dados usado para armazenar informações de usuários e projetos.
    Prisma ORM: Ferramenta usada para modelagem e interação com o banco de dados.

Estrutura de Diretórios

O projeto é dividido em duas partes: backend e frontend.

├── backend
│   ├── prisma
│   │   └── schema.prisma      # Esquema do banco de dados usando Prisma
│   ├── routes
│   │   └── userRoutes.ts      # Rotas de usuários
│   │   └── projectRoutes.ts   # Rotas de projetos
│   ├── middleware
│   │   └── authMiddleware.ts  # Middleware de autenticação
│   ├── server.ts              # Configuração do servidor
│   ├── .env                   # Variáveis de ambiente
│   └── package.json           # Dependências do backend
├── frontend
│   ├── src
│   │   └── App.tsx            # Componente principal do frontend
│   │   └── Login.tsx          # Página de login
│   │   └── Register.tsx       # Página de registro
│   │   └── CreateProject.tsx  # Componente para criar projetos
│   │   └── ProjectList.tsx    # Componente para listar projetos
│   ├── public
│   ├── .env                   # Configurações do frontend
│   └── package.json           # Dependências do frontend

Configuração do Projeto
Pré-requisitos

    Node.js (v14 ou superior)
    MySQL (v8 ou superior)
    Git para controle de versão

Passo a Passo para Instalação

    Clonar o repositório:

git clone https://github.com/Wesleyfsilva/Gestao_Projetos_Mind.git

Configuração do Backend:

    Acesse a pasta backend:

cd backend

Instale as dependências:

npm install

Crie um arquivo .env na raiz da pasta backend com as seguintes variáveis de ambiente:

env

PORT=3001
DATABASE_URL="mysql://usuario:senha@localhost:3306/gestao_projetos"
JWT_SECRET="sua_chave_secreta_para_tokens"

Execute as migrações para criar as tabelas no banco de dados:

npx prisma migrate dev

Inicie o servidor:

    npm start

Configuração do Frontend:

    Acesse a pasta frontend:

cd frontend

Instale as dependências:


npm install

Inicie o servidor do frontend:

    npm start

Banco de Dados:

    Um arquivo de dump (dump.sql) foi gerado para facilitar a importação do banco de dados. Para restaurar o banco, use o seguinte comando:

        mysql -u usuario -p gestao_projetos < dump.sql

Como Utilizar o Sistema

    Registro de Usuário:
        Acesse a página de registro e crie uma nova conta.

    Login:
        Faça login com seu e-mail e senha.

    Adicionar Projetos:
        Após logar, você será redirecionado para a página onde pode criar novos projetos preenchendo o nome, descrição, status e data de entrega.

    Visualizar Projetos:
        Na página de projetos, você poderá ver a lista de todos os seus projetos cadastrados.

    Editar ou Deletar Projetos:
        Use as opções de editar ou deletar para modificar ou remover os projetos.

Endpoints da API
Usuários

    POST /api/users/register: Registrar um novo usuário.
        Corpo da requisição:

        json

    {
      "name": "Nome do Usuário",
      "email": "email@exemplo.com",
      "password": "senha123"
    }

POST /api/users/login: Realizar login.

    Corpo da requisição:

    json

        {
          "email": "email@exemplo.com",
          "password": "senha123"
        }

Projetos

    GET /api/projects: Listar todos os projetos do usuário logado.

    POST /api/projects: Criar um novo projeto.
        Corpo da requisição:

        json

        {
          "name": "Novo Projeto",
          "description": "Descrição do projeto",
          "status": "Em andamento",
          "dueDate": "2024-09-30"
        }

    DELETE /api/projects/:id: Deletar um projeto pelo ID.

Observações

    O projeto foi desenvolvido com foco no aprendizado e tem como objetivo demonstrar o uso de tecnologias modernas de backend e frontend.
    O uso de tokens JWT garante que as rotas protegidas só podem ser acessadas por usuários autenticados.

Contato

    Wesley Ferreira Silva
        E-mail: wesleyfsilva97@gmail.com