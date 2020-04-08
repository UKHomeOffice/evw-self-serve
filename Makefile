NAME=evw/evw-self-serve
REGISTRY=docker.digital.homeoffice.gov.uk
VERSION ?= latest

default: build_self_serve

acceptance_test: network selenium mongo govpay webapp run_tests

build_self_serve:
	@echo "--> Building EVW Self Serve"
	docker build -t ${REGISTRY}/${NAME}:${VERSION} . --build-arg=NPM_AUTH_TOKEN=${NPM_AUTH_TOKEN} --build-arg=NPM_AUTH_USERNAME=${NPM_AUTH_USERNAME} --build-arg=VERSION=${VERSION}

push_self_serve:
	@echo "--> Pushing EVW Self Serve"
	docker tag ${REGISTRY}/${NAME}:${VERSION} ${REGISTRY}/${NAME}:latest
	docker push ${REGISTRY}/${NAME}:${VERSION}
	docker push ${REGISTRY}/${NAME}:latest

run_tests:
	@echo "--> Waiting for EVW Self Serve?"
	sh .waitForContainer.sh webapp.evw-self-serve-${VERSION} "App listening on port 8080"
	@echo "--> Okay I guess EVW Self Serve is up?"

	@echo "--> Running tests"
	docker run --name acceptance-tests.evw-self-serve-${VERSION} --rm \
		-e TEST_URL=http://webapp.evw-self-serve-${VERSION}:8080 \
		-e EVW_HOF_BASE=http://webapp.evw-self-serve-${VERSION}:8080 \
		-e SELENIUM_PORT=4444 \
		-e SELENIUM_HOST=selenium.evw-self-serve-${VERSION} \
		--network evw-self-serve-${VERSION} \
		${REGISTRY}/${NAME}:${VERSION} npm run test:acceptance:chrome

network:
	@echo "--> Creating network evw-self-serve-${VERSION}"
	docker network create evw-self-serve-${VERSION}

webapp:
	docker run --name webapp.evw-self-serve-${VERSION} -d --rm -p8080:8080 \
		-e MONGO_CONNECTION_STRING=mongodb://database.evw-self-serve-${VERSION}:27017/evwselfserve \
		-e PAYMENT_SERVICE=govpay \
		-e GOV_PAY_BASE_URL=http://webapp.evw-self-serve-${VERSION}:8080 \
		-e GOV_PAY_PAYMENT_URL=http://govpay.evw-self-serve-${VERSION}:8060/v1/payments \
		--network evw-self-serve-${VERSION} \
		${REGISTRY}/${NAME}:${VERSION} npm run mock start

mongo:
	@echo "--> Starting mongoDB"
	docker run --name database.evw-self-serve-${VERSION} -d --rm -p27017:27017 \
		--network evw-self-serve-${VERSION} \
		mongo:4.0.17

govpay:
	@echo "--> Starting GovPay stub"
	docker run --name govpay.evw-self-serve-${VERSION} -d --rm -p8060:8060 \
		-e GOV_PAY_BASE_URL=http://govpay.evw-self-serve-${VERSION}:8060 \
		--network evw-self-serve-${VERSION} \
		quay.io/ukhomeofficedigital/gov-uk-pay-stub:latest

selenium:
	@echo "--> Starting selenium"
	docker run --name selenium.evw-self-serve-${VERSION} -d --rm \
		--network evw-self-serve-${VERSION} \
		-v ${PWD}/acceptance_tests/features/images:/app/acceptance_tests/features/images \
		quay.io/ukhomeofficedigital/selenium-standalone-server:v0.2.0

clean:
	@echo "--> Stopping all"
	docker stop database.evw-self-serve-${VERSION} govpay.evw-self-serve-${VERSION} webapp.evw-self-serve-${VERSION} selenium.evw-self-serve-${VERSION}
	@echo "--> Removing network evw-self-serve-${VERSION}"
	docker network rm evw-self-serve-${VERSION}
