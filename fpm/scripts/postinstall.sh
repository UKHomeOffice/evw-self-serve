#!/bin/bash

/bin/chown -R evw-self-serve:evw-self-serve /usr/share/evw-self-serve
/bin/chmod 755 /etc/init.d/evw-self-serve
/bin/mkdir -p /var/log/evw-self-serve
chown -R evw-self-serve:evw-self-serve /var/log/evw-self-serve
/bin/mkdir -p /var/run/evw-self-serve
chown -R evw-self-serve:evw-self-serve /var/run/evw-self-serve
