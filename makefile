# ========================
# Variáveis de ambiente
# ========================
ENV_FILE := .env
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
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d app

database: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d database

database-down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down database

database-stop: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) stop database

sonar-up: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d sonarqube sonar-db

sonar-down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down sonarqube sonar-db

sonar-scan: setup-env
	npm run sonar  # Executa o script de análise do SonarQube definido no package.json

stop: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) stop

down: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down $(SERVICE_NAME)  # Use SERVICE_NAME se definido, ou remova se não necessário

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
	# Remove containers, volumes e redes do projeto
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down -v --remove-orphans

	# Remove imagens criadas com prefixo do projeto
	-docker rmi -f $(shell docker images --filter=reference='$(PROJECT_NAME)*' -q)

	# Remove volumes do projeto (se restarem)
	-docker volume rm $(shell docker volume ls --filter name=$(PROJECT_NAME) -q)

	# Remove redes do projeto (se restarem)
	-docker network rm $(shell docker network ls --filter name=$(PROJECT_NAME) -q)

rebuild-app: setup-env
	@echo "🔄 Rebuildando a imagem do serviço 'app' após instalação de dependências..."
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) build app
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d --force-recreate app

all: setup-env
	docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d  # Inicia todos os serviços, incluindo app e sonar

.PHONY: all rebuild-app setup-env clean-all clean-images force-remove down stop app sonar-up sonar-down sonar-scan clean-safe