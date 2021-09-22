DO_DROPLET_IPV4 = sikeuthought

dev-up:
	docker-compose -f docker-compose.dev.yml up -d

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-res:
	make dev-down
	make dev-up


prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-res:
	make prod-down
	make prod-up

access-server:
	ssh root@$(DO_DROPLET_IPV4)

send-stage-files:
	scp ./docker-compose.prod.yml root@$(DO_DROPLET_IPV4):~
	scp ./.production.env root@$(DO_DROPLET_IPV4):~
