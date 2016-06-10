#!/bin/bash

/usr/bin/getent group evw-self-serve > /dev/null || /usr/sbin/groupadd evw-self-serve
/usr/bin/getent passwd evw-self-serve > /dev/null || /usr/sbin/useradd -r -g evw-self-serve -s /bin/bash -c 'evw-self-serve user' evw-self-serve
