#!/usr/bin/env bash

set -euo pipefail

packageManager=$1
# the benchmark passed in includes flags, so we take only up to the
# first : character for this script
benchmark=$2
dir=$3
cleanType=${benchmark%%:*}

name=${packageManager%%@*}
spec=${packageManager#*@}
[ "$spec" = "" ] || [ "$spec" = "$name" ] && spec="latest"
if [[ "$spec" =~ \#pull/([0-9]+)/head ]]; then
  slug=${name}_pull${BASH_REMATCH[1]}
else
  slug=${name}${spec////_}
fi

# if the source exists, move it to a .temp suffixed location
# if the suffixed location already exists, just remove the source
remove () {
  while [ "${1-}" != "" ]; do
    local source="$1"
    if [ -e "$source" ]; then
      if [ -e "${source}.${slug}.temp" ]; then
        rm -rf "$source"
      else
        mv "$source" "${source}.${slug}.temp"
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
    if [ -e "${source}.${slug}.temp" ]; then
      rm -rf "$source"
      mv "${source}.${slug}.temp" "$source"
    fi
    shift
  done
}

pushd fixtures/${dir}

if [[ ! -f ".prepared-${slug}" ]]; then
  rm -rf cache node_modules package-lock.json yarn.lock
  if [[ "$slug" =~ "npm_pull" ]]; then
    npmVersion=$(npm -v)
    npmMajor=${npmVersion%%.*}
    echo -n "npm@${npmMajor}" > ".prepared-${slug}"
  else
    echo -n "$packageManager" > ".prepared-${slug}"
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
