install:
	cd ../trigger && npm install
	cd ../worker && npm install
	cd ../console/ui && npm install
	cd ../console/admin && npm install

build: install
	cd ../console/ui && npm run build

deploy-all: deploy-trigger deploy-worker deploy

deploy-worker:
	s deploy -t worker.yaml -y --use-local

deploy-trigger:
	s deploy -t trigger.yaml -y --use-local

deploy-admin:
	s admin deploy -y --use-local

deploy-ui:
	s ui deploy -y --use-local

deploy-console:	deploy-admin deploy-ui

deploy:	deploy-console
	s compose deploy -y --use-local
