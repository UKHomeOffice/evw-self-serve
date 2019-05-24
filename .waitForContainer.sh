#!/bin/sh

CONTAINER_NAME=$1
WAIT_STRING=$2
ATTEMPTS=0
MAX_ATTEMPTS=15
SLEEP_BETWEEN_ATTEMPTS=3

waitForString() {
    echo "please wait for the service to come up... [$CONTAINER_NAME, $ATTEMPTS/$MAX_ATTEMPTS]"
    docker logs $CONTAINER_NAME | grep -q "$WAIT_STRING"
    RESULT=$?
    while [ $RESULT -eq 1 ]; do
        if [ $ATTEMPTS -eq $MAX_ATTEMPTS ]; then
            echo -e "Reached maximum attempts. Failing. Did not find $WAIT_STRING in\n";
	    docker logs $CONTAINER_NAME
            exit 1000;
        fi;
        ATTEMPTS=$(expr $ATTEMPTS + 1);
        sleep $SLEEP_BETWEEN_ATTEMPTS;
        waitForString;
    done;
}

waitForString;
