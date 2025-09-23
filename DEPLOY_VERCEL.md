# Deploy na Vercel - Base Church

Este documento contém as instruções para fazer deploy do projeto na Vercel com configuração otimizada para monorepo e Prisma.

## 🚀 Configuração da Vercel

### 1. Configuração do Projeto

- **Framework Preset**: Next.js
- **Root Directory**: `apps/sendo-base`
- **Build Command**: `cd ../.. && pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `cd ../.. && pnpm install --frozen-lockfile`

### 2. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente na Vercel:

```bash
# Database
DATABASE_URL=postgresql://postgres.trcliacdqrdvqdewqbaw:1OQxJVigpzZMf3L1@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Node Environment
NODE_ENV=production
```

### 3. Configuração do Build

O projeto está configurado para:

- ✅ **Monorepo**: Turborepo com workspace pnpm
- ✅ **Prisma**: Cliente otimizado com conexão pooling
- ✅ **Build**: Otimizado com tsup e Next.js
- ✅ **Cache**: Turborepo com cache inteligente
- ✅ **Bundle**: Otimizado para produção

## 📦 Estrutura Otimizada

### Pacote `@repo/db`

- **Build**: tsup com ESM/CJS dual package
- **Client**: Prisma otimizado para produção
- **Types**: TypeScript declarations geradas
- **Cache**: Evita múltiplas instâncias em dev

### Turborepo

- **Dependencies**: Ordem otimizada de build
- **Cache**: Inputs/outputs configurados
- **Parallel**: Build paralelo de pacotes
- **Incremental**: Build incremental otimizado

### Next.js

- **Transpile**: Pacotes internos transpilados
- **Bundle**: Prisma excluído do client-side
- **Images**: Otimização WebP/AVIF
- **Security**: Headers de segurança
- **Standalone**: Output otimizado

## 🔧 Scripts Disponíveis

### Desenvolvimento

```bash
# Desenvolvimento local
pnpm dev

# Build local
pnpm build

# Lint
pnpm lint

# Type check
pnpm typecheck
```

### Database

```bash
# Gerar cliente Prisma
pnpm generate

# Migrations
pnpm db:migrate:deploy

# Seed database
pnpm db:seed
```

## 🚀 Deploy

### 1. Primeiro Deploy

```bash
# 1. Conectar repositório na Vercel
# 2. Configurar variáveis de ambiente
# 3. Deploy automático via Git

# Ou deploy manual
vercel --prod
```

### 2. Deploy Contínuo

- **Git Integration**: Push para `main` = deploy automático
- **Preview**: Branches = preview deployments
- **Rollback**: Interface da Vercel

### 3. Otimizações de Performance

- **Edge Functions**: Configuradas para 30s timeout
- **Regions**: `iad1` (US East)
- **CDN**: Automático via Vercel
- **Caching**: Headers otimizados

## 📊 Monitoramento

### Performance

- **Core Web Vitals**: Monitoramento automático
- **Real User Monitoring**: Dados reais de performance
- **Analytics**: Integração com Vercel Analytics

### Errors

- **Error Tracking**: Logs centralizados
- **Performance**: Métricas detalhadas
- **Uptime**: Monitoramento 24/7

## 🔒 Segurança

### Headers Configurados

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

### Database

- **Connection Pooling**: Configurado no Prisma
- **SSL**: Forçado via URL
- **Environment**: Variáveis seguras

## 📝 Notas Importantes

1. **URLs Fixas**: Mantidas no schema.prisma conforme solicitado
2. **Monorepo**: Configuração otimizada para workspace
3. **Build**: Turborepo + tsup para máxima performance
4. **Cache**: Estratégias otimizadas para Vercel
5. **Bundle**: Otimizado para produção

## 🛠️ Troubleshooting

### Build Fails

```bash
# Limpar cache
pnpm clean

# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

### Database Issues

```bash
# Verificar conexão
pnpm db:push

# Reset migrations
pnpm db:migrate:reset
```

### Performance Issues

- Verificar logs na Vercel
- Monitorar Core Web Vitals
- Otimizar queries Prisma
- Usar cache quando possível

---

**Configuração otimizada para produção na Vercel com monorepo e Prisma! 🎯**
