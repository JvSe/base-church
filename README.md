# Sendo Base - Plataforma de Cursos

Uma plataforma moderna de cursos online construída com Next.js 14, TypeScript, Prisma e Tailwind CSS.

## 🚀 Funcionalidades

### Dashboard Principal

- **Visão Geral**: Feed de novidades, eventos e conteúdos
- **Navegação Intuitiva**: Sidebar com categorias organizadas
- **Progresso Visual**: Acompanhamento de metas e objetivos

### Sistema de Cursos

- **Catálogo Completo**: Busca e filtros avançados
- **Matrículas**: Sistema de inscrição em cursos
- **Progresso**: Acompanhamento de aulas assistidas
- **Certificados**: Emissão automática ao completar cursos

### Player de Vídeo

- **Controles Avançados**: Play/pause, volume, fullscreen
- **Navegação**: Skip forward/backward, progress bar
- **Sidebar**: Lista de aulas com progresso visual
- **Marcação**: Sistema de aulas assistidas e concluídas

### Perfil do Usuário

- **Informações Pessoais**: Bio, localização, habilidades
- **Conquistas**: Sistema de badges e pontos
- **Progresso**: Estatísticas detalhadas de aprendizado
- **Certificados**: Histórico de certificações

### Comunidade

- **Fórum**: Sistema de posts e comentários
- **Eventos**: Calendário de eventos online e presenciais
- **Networking**: Conexão entre usuários

### Jornada de Aprendizado

- **Métricas**: Horas estudadas, sequência de dias
- **Conquistas**: Sistema gamificado de badges
- **Metas**: Definição e acompanhamento de objetivos
- **Atividade**: Histórico detalhado de ações

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utilitária
- **Lucide React**: Ícones modernos
- **Shadcn/ui**: Componentes UI reutilizáveis

### Backend

- **Prisma**: ORM para banco de dados
- **MySQL**: Banco de dados principal
- **Server Actions**: API routes do Next.js
- **NextAuth.js**: Autenticação (preparado)

### Ferramentas

- **Turbo**: Monorepo management
- **ESLint**: Linting de código
- **Prettier**: Formatação de código

## 📁 Estrutura do Projeto

```
base-church/
├── apps/
│   └── sendo-base/           # Aplicação principal
│       ├── src/
│       │   ├── app/          # App Router (Next.js 14)
│       │   │   ├── (private)/ # Rotas protegidas do dashboard
│       │   │   │   └── dashboard/
│       │   │   │       ├── page.tsx              # Dashboard principal
│       │   │   │       ├── profile/              # Perfil do usuário
│       │   │   │       ├── conteudos/            # Meus cursos
│       │   │   │       ├── jornada/              # Progresso e conquistas
│       │   │   │       ├── catalogo/             # Catálogo de cursos
│       │   │   │       ├── eventos/              # Eventos da comunidade
│       │   │   │       ├── forum/                # Fórum da comunidade
│       │   │   │       ├── cursos/[id]/          # Visualização de curso
│       │   │   │       └── aulas/[id]/           # Player de vídeo
│       │   │   └── (public)/ # Rotas públicas
│       │   ├── components/   # Componentes React
│       │   │   ├── sidebar/  # Componentes do sidebar
│       │   │   └── sections/ # Seções da landing page
│       │   ├── lib/          # Utilitários e configurações
│       │   │   └── actions.ts # Server Actions
│       │   └── global.css    # Estilos globais
│       └── public/           # Assets estáticos
├── packages/
│   ├── db/                   # Configuração do banco de dados
│   │   ├── prisma/           # Schema do Prisma
│   │   └── src/
│   ├── ui/                   # Componentes UI compartilhados
│   │   └── src/components/
│   ├── eslint-config/        # Configuração do ESLint
│   ├── typescript-config/    # Configuração do TypeScript
│   └── icons/                # Ícones customizados
└── README.md
```

## 🗄️ Schema do Banco de Dados

### Principais Entidades

- **User**: Usuários da plataforma
- **Course**: Cursos disponíveis
- **Module**: Módulos dos cursos
- **Lesson**: Aulas individuais
- **Enrollment**: Matrículas em cursos
- **LessonProgress**: Progresso nas aulas
- **Certificate**: Certificados emitidos
- **Event**: Eventos da comunidade
- **ForumPost**: Posts do fórum
- **Achievement**: Conquistas e badges

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- pnpm

### Instalação

1. **Clone o repositório**

```bash
git clone <repository-url>
cd base-church
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure o banco de dados**

```bash
# Configure a variável DATABASE_URL no .env
cp .env.example .env
```

4. **Execute as migrações**

```bash
cd packages/db
pnpm prisma migrate dev
```

5. **Inicie o servidor de desenvolvimento**

```bash
pnpm dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia o servidor de desenvolvimento
pnpm build            # Build de produção
pnpm start            # Inicia o servidor de produção

# Banco de dados
pnpm db:generate      # Gera o cliente Prisma
pnpm db:migrate       # Executa migrações
pnpm db:seed          # Popula o banco com dados de teste

# Linting e formatação
pnpm lint             # Executa o ESLint
pnpm format           # Formata o código com Prettier
```

## 🎨 Design System

### Cores Principais

- **Primary**: Purple (#8b5cf6)
- **Secondary**: Gray (#6b7280)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Tipografia

- **Belfast Grotesk**: Títulos e headings
- **Roboto**: Texto do corpo
- **Surgena**: Elementos especiais

### Componentes

- **Cards**: Containers de conteúdo
- **Buttons**: Ações primárias e secundárias
- **Badges**: Status e categorias
- **Progress**: Indicadores de progresso
- **Tabs**: Navegação entre seções

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL="mysql://user:password@localhost:3306/sendo_base"

# NextAuth (opcional)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Upload (opcional)
UPLOADTHING_SECRET="your-upload-secret"
UPLOADTHING_APP_ID="your-app-id"
```

### Configuração do Prisma

O schema do Prisma está localizado em `packages/db/prisma/schema.prisma` e inclui:

- Relacionamentos entre entidades
- Índices para performance
- Validações de dados
- Configurações de cascade

## 📱 Responsividade

A plataforma é totalmente responsiva e funciona em:

- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptativo
- **Mobile**: Layout otimizado para touch

## 🔒 Segurança

- **Server Actions**: Validação no servidor
- **Prisma**: Proteção contra SQL injection
- **TypeScript**: Tipagem estática
- **Next.js**: Proteções built-in

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

- **Netlify**: Compatível com Next.js
- **Railway**: Deploy full-stack
- **AWS**: Amplify ou EC2

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:

- **Email**: suporte@sendo-base.com
- **Discord**: [Link do servidor]
- **Documentação**: [Link da documentação]

---

Desenvolvido com ❤️ pela equipe Sendo Base
