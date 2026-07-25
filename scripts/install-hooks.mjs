import { writeFileSync, chmodSync } from 'fs';

writeFileSync('.git/hooks/pre-commit', '#!/bin/sh\nnode scripts/pre-commit.mjs\n');
chmodSync('.git/hooks/pre-commit', 0o755);
console.log('Hook pre-commit instalado.');
