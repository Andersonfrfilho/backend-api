include .env
export

app:
	docker-compose -p $(PROJECT_NAME) up -d app

stop:
	docker-compose -p $(PROJECT_NAME) stop
.PHONY: stop

down: 
	docker-compose -p $(PROJECT_NAME) stop $(SERVICE_NAME)
	docker-compose -p $(PROJECT_NAME) rm -f $(SERVICE_NAME)

force-remove:
	docker rm -f $(shell docker ps -a -q --filter "name=$(SERVICE_NAME)")

clean-images:
	docker rmi -f $(shell docker images --filter=reference="$(PROJECT_NAME)*" -q)

clean-all:
	# Remove containers, volumes e redes do projeto
	docker-compose -p $(PROJECT_NAME) down -v --remove-orphans

	# Remove imagens criadas com prefixo do projeto
	-docker rmi -f $(shell docker images --filter=reference='$(PROJECT_NAME)*' -q)

	# Remove volumes do projeto (se restarem)
	-docker volume rm $(shell docker volume ls --filter name=$(PROJECT_NAME) -q)

	# Remove redes do projeto (se restarem)
	-docker network rm $(shell docker network ls --filter name=$(PROJECT_NAME) -q)

all: app
.PHONY: all