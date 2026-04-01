# ========================
# Variáveis de ambiente
# ========================
ENV_FILE := .env
ENV_DEV_LOCAL_FILE := .env.dev.local
ENV_EXAMPLE := .env.example
COMPOSE_FILE := docker-compose.yml  # Defina o arquivo docker-compose explicitamente

# Se o .env existir, carrega suas variáveis no Makefile
ifneq ("$(wildcard $(ENV_FILE))","")
include $(ENV_FILE)
export
endif

# ========================
# Regras
# ========================

# Regra para garantir que o .env exista
setup-env:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "⚙️  Criando $(ENV_FILE) a partir de $(ENV_EXAMPLE)..."; \
		cp $(ENV_EXAMPLE) $(ENV_FILE); \
	else \
		echo "✅ $(ENV_FILE) já existe — nada a fazer."; \
	fi

# ========================
# Docker commands
# ========================

app: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d api

database_postgres: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d database_postgres

database_postgres-down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down database_postgres

database_postgres-stop: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) stop database_postgres

database_mongo: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d database_mongo

database_mongo-down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down database_mongo

cache_redis: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d cache_redis

cache_redis-down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down cache_redis

cache_redis-stop: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) stop cache_redis

database_mongo-stop: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) stop database_mongo

queue_rabbitmq: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d queue_rabbitmq
queue_rabbitmq-down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down queue_rabbitmq
queue_rabbitmq-stop: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) stop queue_rabbitmq

keycloak: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d keycloak database_keycloak

keycloak-down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down keycloak database_keycloak

keycloak-stop: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) stop keycloak database_keycloak

keycloak-logs: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) logs -f keycloak

keycloak-admin: setup-env
	@echo "🔗 Keycloak Admin Console: http://localhost:$(KEYCLOAK_PORT)"
	@echo "👤 Username: $(KEYCLOAK_ADMIN_USER)"
	@echo "🔑 Password: $(KEYCLOAK_ADMIN_PASSWORD)"

sonar-up: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d sonarqube sonar-db

sonar-down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down sonarqube sonar-db

sonar-scan: setup-env
	npm run sonar  # Executa o script de análise do SonarQube definido no package.json

# One-shot setup that waits for SonarQube and creates an admin token file at ./sonar_output/sonar_token.env
sonar-setup: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) run --rm sonar-setup

# Show the generated token (if present)
sonar-token: setup-env sonar-setup
	@echo "Token file: ./sonar_output/sonar_token.env"
	@cat ./sonar_output/sonar_token.env || echo "No token found. Run 'make sonar-setup' first."

# Full flow: bring Sonar up, run setup, then run scanner (uses SONAR_TOKEN from token file)
sonar-all: setup-env
	@$(MAKE) sonar-up
	@echo "Waiting 10s for SonarQube to initialize..."
	sleep 10
	@$(MAKE) sonar-setup
	@echo "Loading token and running scanner..."
	@if [ -f ./sonar_output/sonar_token.env ]; then \
		# read token safely without letting Make interpret $ characters
		SONAR_TOKEN=$$(sed -n "s/^SONAR_TOKEN=\(.*\)/\1/p" ./sonar_output/sonar_token.env); \
		export SONAR_TOKEN; \
		# When running scanner from host, SonarQube is reachable at localhost:9001 (mapped)
		SONAR_HOST_URL=http://localhost:9001; \
		SONAR_HOST_URL=$$SONAR_HOST_URL SONAR_TOKEN=$$SONAR_TOKEN npm run sonar; \
	else \
		echo "Token file not found, skipping sonar scan"; \
	fi

stop: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) stop

down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down api database_postgres database_mongo cache_redis queue_rabbitmq keycloak database_keycloak

force-remove: setup-env
	docker rm -f $(shell docker ps -a -q --filter "name=$(SERVICE_NAME)")

clean-images: setup-env
	docker rmi -f $(shell docker images --filter=reference="$(PROJECT_NAME)*" -q)

clean-safe: setup-env
	@echo "🧹 Limpando containers e redes do projeto $(PROJECT_NAME), mas preservando volumes (dados persistentes como SonarQube token e configs)..."
	# Remove apenas containers e redes, sem volumes (-v)
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down --remove-orphans

	# Remove imagens criadas com prefixo do projeto (opcional, preserva dados)
	-docker rmi -f $(shell docker images --filter=reference='$(PROJECT_NAME)*' -q)

	# Remove redes do projeto (se restarem)
	-docker network rm $(shell docker network ls --filter name=$(PROJECT_NAME) -q)

clean-all: setup-env
	@echo "🧹 Limpando todos os recursos do projeto $(PROJECT_NAME)..."
	# Force remove datadog-agent if it exists
	-docker rm -f datadog-agent 2>/dev/null || true
	# Remove containers, volumes e redes do projeto
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down -v --remove-orphans
	# Remove imagens criadas com prefixo do projeto
	-docker rmi -f $(shell docker images --filter=reference='$(PROJECT_NAME)*' -q)

rebuild-app: setup-env
	@echo "🔄 Rebuildando a imagem do serviço 'api' após instalação de dependências..."
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) build api
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d --force-recreate api

all: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d --remove-orphans  # Inicia todos os serviços, incluindo api e sonar
	@echo "📦 Rodando migrations..."
	docker exec -it $(PROJECT_NAME)_api npm run migration:run
	@echo "✅ Projeto iniciado com sucesso!"

setup-e2e-databases: setup-env
	@echo "🔧 Criando bancos de dados E2E..."
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d database_postgres database_mongo
	@echo "⏳ Aguardando PostgreSQL ficar pronto..."
	sleep 3
	@echo "⏳ Aguardando MongoDB ficar pronto..."
	sleep 3
	@echo "✅ Bancos de dados E2E criados com sucesso!"
	@echo "   - PostgreSQL: backend_database_test_e2e"
	@echo "   - MongoDB: backend_test_e2e"

test-e2e-ready: setup-env setup-e2e-databases
	@echo "🧪 Bancos de dados E2E preparados e prontos para testes!"
	npm run test:e2e

test-e2e-docker: setup-env
	@echo "🧪 Iniciando testes E2E com Docker Compose..."
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) --profile e2e up --abort-on-container-exit --exit-code-from e2e-tests

setup: setup-env
	@echo "🚀 Iniciando setup completo do projeto..."
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d --remove-orphans
	@echo "📦 Rodando migrations..."
	docker exec -it $(PROJECT_NAME)_api npm run migration:run
	@echo "✅ Setup completo! Projeto pronto para usar."

.PHONY: all rebuild-app setup-env clean-all clean-images force-remove down stop app sonar-up sonar-down sonar-scan sonar-setup sonar-token sonar-all clean-safe database_postgres database_mongo queue_rabbitmq keycloak keycloak-down keycloak-stop keycloak-logs keycloak-admin setup setup-e2e-databases test-e2e-ready test-e2e-docker 