# Hook de Usuário - useUser

Este hook fornece acesso aos dados do usuário logado e funcionalidades de autenticação usando Zustand para gerenciamento de estado.

## Instalação

O hook usa Zustand para gerenciamento de estado. Certifique-se de que está instalado:

```bash
pnpm add zustand
```

## Uso Básico

```typescript
import { useUser } from "@/src/hooks";

function MeuComponente() {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    updateUserData
  } = useUser();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <div>Usuário não logado</div>;
  }

  return (
    <div>
      <h1>Olá, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>CPF: {user?.cpf}</p>
      <p>Role: {user?.role}</p>
      <p>É Pastor: {user?.isPastor ? 'Sim' : 'Não'}</p>

      <button onClick={logout}>
        Sair
      </button>
    </div>
  );
}
```

## API do Hook

### Estado

- `user`: Dados do usuário logado ou `null`
- `isAuthenticated`: Boolean indicando se o usuário está logado
- `isLoading`: Boolean indicando se está carregando dados

### Ações

- `loadUserFromSession()`: Recarrega dados do usuário da sessão
- `logout()`: Faz logout do usuário
- `updateUserData(updates)`: Atualiza dados do usuário localmente

### Helpers

- `isAdmin`: Boolean - se o usuário é líder
- `isMember`: Boolean - se o usuário é membro
- `isPastor`: Boolean - se o usuário é pastor
- `userName`: String - nome do usuário
- `userEmail`: String - email do usuário
- `userCpf`: String - CPF do usuário

## Interface do Usuário

```typescript
interface User {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  role: "MEMBROS" | "LIDER";
  isPastor?: boolean;
}
```

## Integração com Server Actions

O hook se integra automaticamente com as server actions:

- `signIn()`: Atualiza o store após login
- `signUp()`: Atualiza o store após cadastro
- `getCurrentUser()`: Busca dados completos do usuário

## Exemplo de Uso em Navbar

```typescript
import { useUser } from "@/src/hooks";

function Navbar() {
  const { user, isAuthenticated, logout } = useUser();

  return (
    <nav>
      {isAuthenticated ? (
        <div>
          <span>Olá, {user?.name}</span>
          <button onClick={logout}>Sair</button>
        </div>
      ) : (
        <a href="/signin">Entrar</a>
      )}
    </nav>
  );
}
```

## Exemplo de Uso em Página Protegida

```typescript
import { useUser } from "@/src/hooks";
import { redirect } from "next/navigation";

function PaginaProtegida() {
  const { user, isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    redirect("/signin");
  }

  // Verificar permissões
  if (user?.role !== "LIDER") {
    return <div>Acesso negado</div>;
  }

  return (
    <div>
      <h1>Área de Líderes</h1>
      <p>Bem-vindo, {user.name}!</p>
    </div>
  );
}
```

## Persistência

O hook usa Zustand com persistência no localStorage, mantendo os dados do usuário entre sessões do navegador.

## Sincronização com Sessão

O hook se sincroniza automaticamente com:

- Cookies de sessão do servidor
- Dados do banco de dados
- Estado local do Zustand

## Tratamento de Erros

O hook inclui tratamento de erros para:

- Sessão expirada
- Dados inválidos
- Falhas de rede
- Usuário não encontrado

## Debug

Para debug, você pode usar:

```typescript
const { user, isAuthenticated, isLoading } = useUser();

console.log("User:", user);
console.log("Is Authenticated:", isAuthenticated);
console.log("Is Loading:", isLoading);
```
