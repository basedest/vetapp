.PHONY: frontend
frontend:
	cd frontend
	npm install
	npm run build

.PHONY: backend
backend:
	npm install
	npm run build

.PHONY: build
build: frontend backend