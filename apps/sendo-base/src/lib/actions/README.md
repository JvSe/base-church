# Actions - Organização por Domínio

Este diretório contém todas as server actions organizadas por domínio de funcionalidade. Cada arquivo representa um domínio específico do sistema.

## Estrutura dos Arquivos

### 📁 `user.actions.ts`

Actions relacionadas ao gerenciamento de usuários:

- Perfil de usuário (atualização, busca)
- Gerenciamento de estudantes
- Estatísticas de usuários
- Configurações de notificação
- Roles e permissões

### 📁 `course.actions.ts`

Actions relacionadas aos cursos:

- CRUD de cursos
- Módulos e lições
- Progresso de lições
- Busca e filtros de cursos

### 📁 `enrollment.actions.ts`

Actions relacionadas às matrículas:

- Solicitação de matrícula
- Aprovação/rejeição de matrículas
- Status de matrícula
- Gerenciamento de matrículas

### 📁 `dashboard.actions.ts`

Actions relacionadas ao dashboard administrativo:

- Estatísticas gerais
- Analytics e métricas
- Cache de dados
- Testes de dados

### 📁 `auth.actions.ts`

Actions relacionadas à autenticação:

- Login e registro
- Recuperação de senha
- Gerenciamento de sessão
- Validação de CPF

### 📁 `certificate.actions.ts`

Actions relacionadas aos certificados:

- Emissão de certificados
- Estatísticas de certificados
- Revogação de certificados
- Busca de certificados

### 📁 `community.actions.ts`

Actions relacionadas à comunidade:

- Fórum e posts
- Eventos
- Reviews e avaliações
- Notificações
- Busca de conteúdo
- Achievements

## Como Usar

Todas as actions são re-exportadas no arquivo principal `actions.ts`, então você pode importar qualquer action da mesma forma que antes:

```typescript
import {
  signUp,
  getCourses,
  createEnrollmentRequest,
  getDashboardStats,
} from "@/lib/actions";
```

## Benefícios da Organização

1. **Manutenibilidade**: Cada domínio tem suas próprias responsabilidades
2. **Escalabilidade**: Fácil adicionar novas actions em domínios específicos
3. **Colaboração**: Diferentes desenvolvedores podem trabalhar em domínios diferentes
4. **Testabilidade**: Mais fácil de testar funcionalidades isoladas
5. **Legibilidade**: Código mais organizado e fácil de navegar

## Convenções

- Cada arquivo deve ter o sufixo `.actions.ts`
- Actions devem ser agrupadas por funcionalidade relacionada
- Use imports relativos para helpers quando necessário
- Mantenha a consistência nos tipos de retorno (`{ success: boolean, ... }`)
- Sempre inclua tratamento de erro adequado
