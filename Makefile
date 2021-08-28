
dev: 
	./bin/pre-up
	docker-compose build

prod:
	docker-compose -f ./docker-compose.prod.yaml build

