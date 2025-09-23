#!/bin/bash

# Build script for the database package
set -e

echo "🔨 Building @repo/db package..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf generated/

# Generate Prisma client
echo "⚡ Generating Prisma client..."
pnpm prisma generate --generator client

# Compile TypeScript
echo "📦 Compiling TypeScript..."
pnpm tsup

# Verify build
echo "✅ Verifying build..."
if [ -d "dist" ] && [ -d "generated" ]; then
    echo "🎉 Build completed successfully!"
    echo "📁 Generated files:"
    echo "  - dist/ (compiled JS/TS)"
    echo "  - generated/ (Prisma client)"
else
    echo "❌ Build failed!"
    exit 1
fi
