# Base Church - Monorepo

Este é um monorepo usando Turbo e pnpm para gerenciar múltiplos packages relacionados à plataforma Base Church.

## 📦 Packages

### `@repo/ui` - Componentes UI

Biblioteca de componentes React reutilizáveis baseada em shadcn/ui.

**Exports:**

```typescript
// Importar componentes específicos
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";

// Importar todos os componentes
import * as UI from "@repo/ui/components";

// Importar hooks
import { useIsMobile } from "@repo/ui/hooks/use-mobile";

// Importar utilitários
import { cn } from "@repo/ui/lib/utils";

// Importar estilos globais
import "@repo/ui/globals.css";
```

### `@repo/db` - Banco de Dados

Cliente Prisma e configurações de banco de dados.

**Exports:**

```typescript
// Cliente Prisma
import { prisma } from "@repo/db";

// Schema do Prisma
import "@repo/db/schema";

// Seed do banco
import "@repo/db/seed";
```

### `@repo/icons` - Ícones Customizados

Biblioteca de ícones customizados para a Base Church.

**Exports:**

```typescript
// Componente principal de ícones
import { IconsNextMed } from "@repo/icons";

// Ícones específicos
import { SendoBase } from "@repo/icons/components/send-base";
```

### `@repo/typescript-config` - Configurações TypeScript

Configurações compartilhadas do TypeScript.

**Exports:**

```json
{
  "extends": "@repo/typescript-config/base",
  "extends": "@repo/typescript-config/nextjs",
  "extends": "@repo/typescript-config/react-library"
}
```

### `@repo/eslint-config` - Configurações ESLint

Configurações compartilhadas do ESLint.

**Exports:**

```json
{
  "extends": "@repo/eslint-config/base",
  "extends": "@repo/eslint-config/next-js",
  "extends": "@repo/eslint-config/react-internal"
}
```

## 🚀 Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar desenvolvimento
pnpm dev

# Build de todos os packages
pnpm build

# Lint de todos os packages
pnpm lint
```

### Banco de Dados

```bash
# Gerar cliente Prisma
pnpm generate

# Migração de desenvolvimento
pnpm db:migrate:dev

# Deploy de migrações
pnpm db:migrate:deploy

# Push do schema
pnpm db:push

# Seed do banco
pnpm db:seed
```

## 📁 Estrutura do Projeto

```
base-church/
├── apps/
│   └── sendo-base/          # Aplicação principal
├── packages/
│   ├── ui/                  # Componentes UI
│   ├── db/                  # Banco de dados
│   ├── icons/               # Ícones customizados
│   ├── typescript-config/   # Config TypeScript
│   └── eslint-config/       # Config ESLint
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

## 🔧 Configuração

1. **Instalar dependências:**

   ```bash
   pnpm install
   ```

2. **Configurar variáveis de ambiente:**

   ```bash
   cp apps/sendo-base/.env.example apps/sendo-base/.env
   ```

3. **Gerar cliente Prisma:**

   ```bash
   pnpm generate
   ```

4. **Iniciar desenvolvimento:**
   ```bash
   pnpm dev
   ```

## 📝 Convenções

- **Naming:** Todos os packages usam o prefixo `@repo/`
- **Exports:** Cada package define seus exports no `package.json`
- **TypeScript:** Configurações compartilhadas via `@repo/typescript-config`
- **ESLint:** Configurações compartilhadas via `@repo/eslint-config`
- **Dependências:** Usar `workspace:*` para dependências internas

## 🤝 Contribuição

1. Faça suas alterações no package apropriado
2. Atualize os exports se necessário
3. Execute `pnpm lint` para verificar
4. Execute `pnpm build` para testar o build
5. Commit suas alterações
