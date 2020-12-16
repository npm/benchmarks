#!/usr/bin/env bash

# the second parameter is currently a workaround for logging purposes and otherwise ignored
packageManager=$1
dir=$3

pushd fixtures/${dir}

case $packageManager in
  npm)
    npm install --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
    ;;
esac

popd
