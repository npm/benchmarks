#!/usr/bin/env bash

set -euo pipefail

# the second parameter is currently a workaround for logging purposes and otherwise ignored
packageManager=$1
benchmark=$2
# the benchmark variable includes both the name of the benchmark, as well as the flags
# so we take everything after the first : (colon) character as a flag
flags=${benchmark#*:}
# unset flags if none were actually specified
if [ "$flags" = "$benchmark" ]; then
  flags=""
fi
dir=$3

pushd fixtures/${dir}
escapedManager=${packageManager//\//_}
packageManager=`cat .prepared-${escapedManager}`

case $packageManager in
  npm@7)
    case $flags in
      audit)
        exec npm install --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
      legacy-peer-deps)
        exec npm install --no-audit --legacy-peer-deps --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
      *)
        exec npm install --no-audit --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
    esac
    ;;
  npm@6)
    case $flags in
      audit)
        exec npm install --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
      legacy-peer-deps)
        # legacy-peer-deps not supported
        exec false
        ;;
      *)
        exec npm install --no-audit --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
    esac
    ;;
  yarn@latest)
    case $flags in
      audit)
        exec yarn install --audit --ignore-scripts --cache-folder ./cache
        ;;
      legacy-peer-deps)
        # no way to turn off installing peer deps
        exec false
        ;;
      *)
        exec yarn install --ignore-scripts --cache-folder ./cache
    esac
    ;;
  pnpm@latest)
    case $flags in
      audit)
        # no way to run an audit at install time
        exec false
        ;;
      legacy-peer-deps)
        # no way to turn off installing peer deps
        exec false
        ;;
      *)
        exec pnpm install --ignore-scripts --store-dir ./cache --registry https://registry.npmjs.org
        ;;
    esac
    ;;
esac
