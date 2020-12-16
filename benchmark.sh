#!/usr/bin/env bash

set -e

# set the package managers we will benchmark
# these will be passed to prepare.sh and execute.sh as the first parameter
event=$1
case $event in
  pull)
    managers="npm"
    resultPath="results/pulls/`date +%s`.json"
    ;;
  push)
    managers="npm"
    resultPath="results/releases/release.json"
    ;;
  *)
    >&2 echo "usage: benchmark.sh [pull|push]"
    false
esac

# the benchmark name types
# these will be passed to prepare.sh and execute.sh as the second parameter
benchmarks="clean,lock-only,cache-only,modules-only,no-lock,no-cache,no-modules,no-clean"

# gather a comma separated list of fixture names
# these will be passed to prepare.sh and execute.sh as the third parameter
fixtures=`ls -m fixtures | sed 's/, /,/g'`

hyperfine --style basic \
  --export-json $resultPath \
  --min-runs 3 \
  --parameter-list manager $managers \
  --parameter-list benchmark $benchmarks \
  --parameter-list fixture $fixtures \
  --prepare './prepare.sh {manager} {benchmark} {fixture}' \
  './execute.sh {manager} {benchmark} {fixture}'
