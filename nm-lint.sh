#!/bin/bash

# App name: jq
# App description: Lightweight and flexible command-line JSON processor
# App website: https://stedolan.github.io/jq/

set -e

jq -r '.dependencies,.devDependencies|keys[]' package.json | while read line; do \
  if [ "$(npm show "$line" | grep -ic 'DEPRECATED')" != "0" ];
    then
      printf "$line: "
      printf "\e[1;31m""DEPRECATED\n""\e[0m"
      exit 1
  fi
done

npm audit