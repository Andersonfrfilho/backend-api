export const PATH_ENTITIES_PATTERN = [
  process.cwd() + '/src/**/*.entity{.ts,.js}',
  process.cwd() + '/dist/**/*.entity{.ts,.js}',
];

export const PATH_MIGRATIONS_PATTERN = [
  process.cwd() + '/src/modules/shared/infrastructure/providers/database/migrations/*{.ts,.js}',
  process.cwd() + '/dist/modules/shared/infrastructure/providers/database/migrations/*{.ts,.js}',
];
