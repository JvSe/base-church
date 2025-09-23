# @repo/db

Database package for the Base Church application using Prisma ORM.

## Features

- ✅ Optimized for Vercel deployment
- ✅ Monorepo compatible with Turborepo
- ✅ TypeScript support with full type safety
- ✅ Production-ready client configuration
- ✅ Graceful shutdown handling
- ✅ Health check utilities

## Usage

### Import the client

```typescript
import { prisma } from "@repo/db";
// or
import { prisma } from "@repo/db/client";
```

### Import types

```typescript
import type { User, Course, Enrollment } from "@repo/db";
```

### Use database utilities

```typescript
import { db } from "@repo/db";

// Health check
const health = await db.health();

// Transaction
await db.transaction(async (tx) => {
  // Your transaction logic
});

// Raw queries
const result = await db.raw`SELECT * FROM users`;
```

## Development

### Generate Prisma client

```bash
pnpm generate
```

### Build the package

```bash
pnpm build
```

### Run migrations

```bash
pnpm db:migrate:deploy
```

### Seed the database

```bash
pnpm db:seed
```

## Production Deployment

This package is optimized for Vercel deployment:

1. **Automatic generation**: The Prisma client is automatically generated during build
2. **Binary targets**: Configured for Vercel's runtime environment
3. **Connection pooling**: Optimized for serverless functions
4. **Graceful shutdown**: Properly disconnects from the database

## Architecture

- `src/client.ts` - Main Prisma client with Vercel optimizations
- `src/index.ts` - Package exports and utilities
- `src/seed.ts` - Database seeding script
- `prisma/schema.prisma` - Database schema definition
- `generated/` - Auto-generated Prisma client (do not edit)

## Troubleshooting

### Vercel deployment issues

1. Ensure the `postinstall` script runs successfully
2. Check that binary targets are correctly configured
3. Verify database connection strings are accessible from Vercel

### Monorepo issues

1. Make sure the package is properly transpiled in Next.js config
2. Verify that Prisma is hoisted correctly in the monorepo
3. Check that build dependencies are properly configured in Turborepo
