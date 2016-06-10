#!/bin/bash

if [ $1 = "remove" ]; then
  echo "deleting user data on uninstall"
  /usr/bin/getent passwd evw-self-serve > /dev/null && /usr/sbin/userdel evw-self-serve || /bin/true
  /usr/bin/getent group evw-self-serve > /dev/null && /usr/sbin/groupdel evw-self-serve || /bin/true
fi

exit 0
