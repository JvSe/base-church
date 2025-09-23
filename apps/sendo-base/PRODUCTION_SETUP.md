# 🚀 Configuração para Produção - Base Church

## ⚠️ Problemas Identificados e Corrigidos

### 1. **URL do Banco Hardcoded** ✅ CORRIGIDO

- **Problema**: URL do banco estava hardcoded no `schema.prisma`
- **Solução**: Movido para variáveis de ambiente `DATABASE_URL` e `DATABASE_DIRECT_URL`

### 2. **Configuração de Cookies** ✅ CORRIGIDO

- **Problema**: Cookies `Secure` e `SameSite=Strict` causavam problemas em produção
- **Solução**: Configuração dinâmica baseada no ambiente

### 3. **Configuração do Prisma** ✅ CORRIGIDO

- **Problema**: Falta de configurações específicas para produção
- **Solução**: Cliente Prisma configurado com timeouts e logs apropriados

## 📋 Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` ou configure as seguintes variáveis no seu provedor de hospedagem:

```bash
# Database Configuration (OBRIGATÓRIO)
DATABASE_URL="postgresql://username:password@host:port/database?pgbouncer=true"
DATABASE_DIRECT_URL="postgresql://username:password@host:port/database"

# Session Configuration (OBRIGATÓRIO)
SESSION_SECRET="seu-secret-key-super-seguro-aqui"
NEXTAUTH_URL="https://seu-dominio.com"
NEXTAUTH_SECRET="seu-nextauth-secret-aqui"

# Application Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
```

## 🔧 Comandos para Deploy

### 1. **Build do Projeto**

```bash
# Instalar dependências
pnpm install

# Gerar cliente Prisma
pnpm prisma generate --schema=../../packages/db/prisma/schema.prisma

# Build do projeto
pnpm build
```

### 2. **Migração do Banco (se necessário)**

```bash
# Aplicar migrações
pnpm prisma migrate deploy --schema=../../packages/db/prisma/schema.prisma
```

### 3. **Iniciar em Produção**

```bash
pnpm start
```

## 🛡️ Configurações de Segurança Adicionadas

### Next.js Config

- ✅ `serverComponentsExternalPackages` para Prisma
- ✅ Headers de segurança (X-Frame-Options, X-Content-Type-Options, etc.)

### Prisma Config

- ✅ Logs apropriados por ambiente
- ✅ Timeouts configurados para produção
- ✅ Validação de conexão

### Session Config

- ✅ Cookies dinâmicos baseados no ambiente
- ✅ Configuração `SameSite=Lax` para compatibilidade

## 🔍 Verificação de Problemas

### Se ainda houver problemas:

1. **Verifique as variáveis de ambiente**:

   ```bash
   echo $DATABASE_URL
   echo $NODE_ENV
   ```

2. **Teste a conexão com o banco**:

   ```bash
   pnpm prisma db push --schema=../../packages/db/prisma/schema.prisma
   ```

3. **Verifique os logs**:
   - Em desenvolvimento: logs completos
   - Em produção: apenas erros

4. **Validação de ambiente**:
   - O sistema agora valida automaticamente as variáveis críticas

## 📞 Próximos Passos

1. Configure as variáveis de ambiente no seu provedor
2. Execute o build com `pnpm build`
3. Teste localmente com `NODE_ENV=production pnpm start`
4. Deploy para produção

## 🆘 Suporte

Se ainda houver problemas, verifique:

- ✅ Variáveis de ambiente configuradas
- ✅ Banco de dados acessível
- ✅ Prisma client gerado
- ✅ Build sem erros
