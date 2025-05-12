## Inicia el entorno de producción
## Sirve el build de /dist con NGINX
prod:
	npm run docker-prod

.PHONY: build

## Compila el frontend en modo producción
build:
	npm run build

.PHONY: preview

## Muestra que el build está disponible en /dist
preview:
	npm run preview

.PHONY: test

## Ejecuta los tests con cobertura
## Requiere jest
test:
	npm run test

.PHONY: down

## Detiene y limpia contenedores y volúmenes
## Útil cuando quieres reiniciar desde cero
## O prevenir conflictos de caché
clean:
	npm run docker-down

.PHONY: commit

## Crea un commit usando Commitizen
## Sigue las convenciones de commits
commit:
	npm run commit

.PHONY: dev

## Inicia el entorno de desarrollo
dev:
	npm run docker-start
