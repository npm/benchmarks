#!/usr/bin/env bash

set -euo pipefail

packageManager=$1
# the benchmark passed in includes flags, so we take only up to the
# first : character for this script
benchmark=$2
dir=$3
cleanType=${benchmark%%:*}

# if the source exists, move it to a .temp suffixed location
# if the suffixed location already exists, just remove the source
remove () {
  while [ "${1-}" != "" ]; do
    local source="$1"
    if [ -e "$source" ]; then
      if [ -e "${source}.${packageManager}.temp" ]; then
        rm -rf "$source"
      else
        mv "$source" "${source}.${packageManager}.temp"
      fi
    fi
    shift
  done
}

# if the source already exists, do nothing
# if the .temp suffixed source exists, move it to the source location
restore () {
  while [ "${1-}" != "" ]; do
    local source="$1"
    if [ -e "${source}.${packageManager}.temp" ]; then
      rm -rf "$source"
      mv "${source}.${packageManager}.temp" "$source"
    fi
    shift
  done
}

pushd fixtures/"$dir"

escapedManager=${packageManager//\//_}
if [[ ! -f ".prepared-${escapedManager}" ]]; then
  # pre-install the requested package manager
  npm i -g "$packageManager"
  rm -rf cache node_modules package-lock.json yarn.lock
  if [[ "$packageManager" =~ "npm/cli" ]]; then
    npmVersion=$(npm -v)
    npmMajor=${npmVersion%%.*}
    echo -n "npm@${npmMajor}" > ".prepared-${escapedManager}"
  else
    echo -n "$packageManager" > ".prepared-${escapedManager}"
  fi
fi

case $cleanType in
  clean)
    remove cache node_modules package-lock.json yarn.lock pnpm-lock.yaml
    ;;
  lock-only)
    remove cache node_modules
    restore package-lock.json yarn.lock pnpm-lock.yaml
    ;;
  cache-only)
    remove node_modules package-lock.json yarn.lock pnpm-lock.yaml
    restore cache
    ;;
  modules-only)
    remove cache package-lock.json yarn.lock pnpm-lock.yaml
    restore node_modules
    ;;
  no-lock)
    remove package-lock.json yarn.lock pnpm-lock.yaml
    restore cache node_modules
    ;;
  no-cache)
    remove cache
    restore node_modules package-lock.json yarn.lock pnpm-lock.yaml
    ;;
  no-modules)
    remove node_modules
    restore cache package-lock.json yarn.lock pnpm-lock.yaml
    ;;
  no-clean)
    restore cache node_modules package-lock.json yarn.lock pnpm-lock.yaml
    ;;
esac

popd
