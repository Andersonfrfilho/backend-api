#!/usr/bin/env node

const { execSync } = require('child_process');

const command = process.argv[2];
const isProd = process.env.NODE_ENV === 'production';

// Detecta o caminho baseado em NODE_ENV
const basePath = isProd ? 'dist' : 'src';
const fileExt = isProd ? 'js' : 'ts';
const executor = isProd ? 'node' : 'ts-node -r tsconfig-paths/register';

const dataSourcePath = `${basePath}/modules/shared/infrastructure/providers/database/implementations/postgres/postgres.database-connection.${fileExt}`;

const validCommands = ['show', 'run', 'revert', 'generate'];

if (!validCommands.includes(command)) {
  console.error(`❌ Comando inválido: ${command}`);
  console.error(`Comandos válidos: ${validCommands.join(', ')}`);
  process.exit(1);
}

try {
  const cmd = `${executor} ./node_modules/typeorm/cli.js migration:${command} -d ${dataSourcePath}`;
  console.log(`📍 NODE_ENV=${process.env.NODE_ENV || 'development'} → ${dataSourcePath}`);
  execSync(cmd, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
