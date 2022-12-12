.PHONY: frontend
frontend:
	cd frontend && yarn install && yarn build

.PHONY: backend
backend:
	yarn install
	yarn build

.PHONY: build
build: frontend backend