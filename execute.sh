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
name=${packageManager%%@*}
spec=${packageManager#*@}
[ "$spec" = "" ] || [ "$spec" = "$name" ] && spec="latest"
if [[ "$spec" =~ \#pull/([0-9]+)/head ]]; then
  slug=${name}_pull${BASH_REMATCH[1]}
else
  slug=${name}${spec////_}
fi
packageManager=`cat .prepared-${slug}`

case $packageManager in
  npm@7)
    case $flags in
      audit)
        exec ../../node_modules/${slug}/bin/npm-cli.js install --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
      legacy-peer-deps)
        exec ../../node_modules/${slug}/bin/npm-cli.js install --no-audit --legacy-peer-deps --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
      *)
        exec ../../node_modules/${slug}/bin/npm-cli.js install --no-audit --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
    esac
    ;;
  npm@6)
    case $flags in
      audit)
        exec ../../node_modules/${slug}/bin/npm-cli.js install --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
      legacy-peer-deps)
        # legacy-peer-deps not supported
        exec false
        ;;
      *)
        exec ../../node_modules/${slug}/bin/npm-cli.js install --no-audit --ignore-scripts --cache ./cache --registry https://registry.npmjs.org
        ;;
    esac
    ;;
  yarn)
    case $flags in
      audit)
        exec ../../node_modules/yarn/bin/yarn.js --audit --ignore-scripts --cache-folder ./cache
        ;;
      legacy-peer-deps)
        # no way to turn off installing peer deps
        exec false
        ;;
      *)
        exec ../../node_modules/yarn/bin/yarn.js --ignore-scripts --cache-folder ./cache
    esac
    ;;
  pnpm)
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
        exec ../../node_modules/pnpm/bin/pnpm.js install --ignore-scripts --store-dir ./cache --registry https://registry.npmjs.org
        ;;
    esac
    ;;
esac
