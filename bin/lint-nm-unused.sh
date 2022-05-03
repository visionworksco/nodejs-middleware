#!/bin/bash

# App name: fd
# App website: https://github.com/sharkdp/fd

set -e

DIRNAME=${1:-.}
cd $DIRNAME

FILES=$(mktemp)
PACKAGES=$(mktemp)

function check {
    cat package.json \
        | jq "{} + .$1 | keys" \
        | sed -n 's/.*"\(.*\)".*/\1/p' > $PACKAGES
    echo "--------------------------"
    echo "Checking $1... WARNING: ALL DEPENDENCIES LISTED BELOW REQUIRE DOUBLE CHECK MANUALLY!"
    fd '(js|jsx|ts|tsx|json)$' -t f > $FILES
    while read PACKAGE
    do
        if [ -d "node_modules/${PACKAGE}" ]; then
            fd  -t f '(js|jsx|ts|tsx|json)$' node_modules/${PACKAGE} >> $FILES
        fi
        RES=$(cat $FILES | xargs -I {} -P 8 egrep -i "(import|require|loader|plugins|${PACKAGE}).*['\"](${PACKAGE}|.?\d+)[\"']" '{}' | wc -l)

        if [ $RES = 0 ]
        then
            echo -e "UNUSED\t\t $PACKAGE"
        fi
    done < $PACKAGES
}

check "dependencies"
check "peerDependencies"