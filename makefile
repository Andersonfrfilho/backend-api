# ========================
# Variáveis de ambiente
# ========================
ENV_FILE := .env
ENV_EXAMPLE := .env.example

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
	docker-compose -p $(PROJECT_NAME) up -d app

stop: setup-env
	docker-compose -p $(PROJECT_NAME) stop
.PHONY: stop

down: setup-env
	docker-compose -p $(PROJECT_NAME) stop $(SERVICE_NAME)
	docker-compose -p $(PROJECT_NAME) rm -f $(SERVICE_NAME)

force-remove: setup-env
	docker rm -f $(shell docker ps -a -q --filter "name=$(SERVICE_NAME)")

clean-images: setup-env
	docker rmi -f $(shell docker images --filter=reference="$(PROJECT_NAME)*" -q)

clean-all: setup-env
	@echo "🧹 Limpando todos os recursos do projeto $(PROJECT_NAME)..."
	# Remove containers, volumes e redes do projeto
	docker-compose -p $(PROJECT_NAME) down -v --remove-orphans

	# Remove imagens criadas com prefixo do projeto
	-docker rmi -f $(shell docker images --filter=reference='$(PROJECT_NAME)*' -q)

	# Remove volumes do projeto (se restarem)
	-docker volume rm $(shell docker volume ls --filter name=$(PROJECT_NAME) -q)

	# Remove redes do projeto (se restarem)
	-docker network rm $(shell docker network ls --filter name=$(PROJECT_NAME) -q)

all: app
.PHONY: all setup-env clean-all clean-images force-remove down stop app
