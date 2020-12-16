#!/usr/bin/env bash

packageManager=$1
cleanType=$2

# if the source exists, move it to a .temp suffixed location
# if the suffixed location already exists, just remove the source
remove () {
  local source="$1"
  if [ -e "$source" ]; then
    if [ -e "${source}.temp" ]; then
      rm -rf "$source"
    else
      mv "$source" "${source}.temp"
    fi
  fi
}

# if the source already exists, do nothing
# if the .temp suffixed source exists, move it to the source location
restore () {
  local source="$1"
  if [ -e "$source" ]; then
    true
  elif [ -e "${source}.temp" ]; then
    mv "${source}.temp" "$source"
  fi
}

pushd fixtures/"$3"

case $cleanType in
  clean)
    remove cache
    remove node_modules
    remove package-lock.json
    ;;
  lock-only)
    remove cache
    remove node_modules
    restore package-lock.json
    ;;
  cache-only)
    remove node_modules
    remove package-lock.json
    restore cache
    ;;
  modules-only)
    remove cache
    remove package-lock.json
    restore node_modules
    ;;
  no-lock)
    remove package-lock.json
    restore cache
    restore node_modules
    ;;
  no-cache)
    remove cache
    restore node_modules
    restore package-lock.json
    ;;
  no-modules)
    remove node_modules
    restore cache
    restore package-lock.json
    ;;
  no-clean)
    restore cache
    restore node_modules
    restore package-lock.json
    ;;
esac

popd
