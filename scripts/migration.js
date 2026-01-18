#!/usr/bin/env node

const { execSync } = require('child_process');

const command = process.argv[2];
const isProd = process.env.NODE_ENV === 'production';

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
  // Se o comando for 'run' e o erro for sobre tabela já existente, pode ser que não há migrações pendentes
  if (
    command === 'run' &&
    error.stderr &&
    error.stderr.includes('duplicate key value violates unique constraint')
  ) {
    console.log('ℹ️  Tabela de migrações já existe. Verificando se há migrações pendentes...');
    try {
      const showCmd = `${executor} ./node_modules/typeorm/cli.js migration:show -d ${dataSourcePath}`;
      const showOutput = execSync(showCmd, { encoding: 'utf8' });
      const hasPending = showOutput.includes('[ ]'); // [ ] indica migração pendente
      if (!hasPending) {
        console.log('✅ Nenhuma migração pendente encontrada. Continuando...');
        process.exit(0);
      }
    } catch (showError) {
      console.log('⚠️  Não foi possível verificar migrações pendentes. Erro original:');
    }
  }
  process.exit(1);
}
