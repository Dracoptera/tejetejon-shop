import { existsSync, mkdirSync, writeFileSync, chmodSync } from 'fs';

if (!existsSync('.git')) {
  console.log('No es un checkout de git, se omite instalación de hooks.');
  process.exit(0);
}

mkdirSync('.git/hooks', { recursive: true });
writeFileSync('.git/hooks/pre-commit', '#!/bin/sh\nnode scripts/pre-commit.mjs\n');
chmodSync('.git/hooks/pre-commit', 0o755);
console.log('Hook pre-commit instalado.');
