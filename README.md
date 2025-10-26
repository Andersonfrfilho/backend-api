## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## estrutura do projeto

src/
├── common/ # Itens compartilhados entre módulos (utils, dtos genéricos, etc.)
│ ├── dtos/ # DTOs compartilhados (ex: pagination.dto.ts)
│ ├── filters/ # Filtros globais (ex: error-filter.ts)
│ ├── interfaces/ # Interfaces compartilhadas (ex: log.interface.ts)
│ ├── utils/ # Funções utilitárias (ex: date.utils.ts)
│ └── common.module.ts # Módulo para exportar itens compartilhados
├── config/ # Configurações da app (env, validação)
│ ├── env.validation.ts # Validação de variáveis de ambiente
│ └── config.module.ts # Módulo para configurações (opcional)
├── core/ # Núcleo da app (interceptors, providers globais)
│ ├── interceptors/ # Interceptors globais
│ │ └── log.interceptor.ts
│ ├── providers/ # Providers globais (ex: log.provider.ts)
│ │ └── log.constants.ts
│ └── core.module.ts # Módulo para importar no AppModule
├── modules/ # Módulos por feature/domínio da API
│ ├── auth/ # Módulo de autenticação
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ ├── auth.module.ts
│ │ ├── dtos/ # DTOs específicos (ex: login.dto.ts)
│ │ └── entities/ # Entities se usar ORM (ex: user.entity.ts)
│ ├── health/ # Módulo de health check
│ │ ├── health.controller.ts
│ │ ├── health.service.ts
│ │ ├── health.service.interface.ts # Se precisar de interfaces
│ │ └── health.module.ts
│ └── user/ # Exemplo de outro módulo (usuários)
│ ├── user.controller.ts
│ ├── user.service.ts
│ ├── user.module.ts
│ ├── dtos/ # DTOs específicos
│ └── entities/ # Entities específicas
├── app.module.ts # Módulo raiz que importa todos os outros
├── main.ts # Entry point da app
└── app.controller.ts # Controller global (opcional, para rotas raiz)

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- [x] Docker
- [x] Docker Development
- [x] Env config validation
- [x] Adicionar Modulo de usuário exemplo
- [x] Adicionar FastiFy
- [ ] Adicionar versionamento de rota
- [ ] Singleton
- [x] path alias
- [x] Makefile - MacOs | Linux
- [ ] Makefile - Windows
- [] Tratamento erros globais
- [x] Logger
- [x] Logger Obfucator
- [] Middleware Oauth
- [] global state
- [] Sonar
- [] Github Actions
- [] (lint, commit-lint, test-unitario, teste de integracao, deploy stg, sonar, fortify, deploy, producao )
- [] Teste Unitarios
- [] Middleware de validacao de schemas
- [] swagger docs
- [] conexao com banco de dados SQL
- [] conexao com banco de dados noSQL
- [] conexao com bando de dados de cache
- [] conexao com rabbitmq producer
- [] TDD
- [] Clean Architecture

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
