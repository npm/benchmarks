#!/usr/bin/env bash

set -euo pipefail
trap times EXIT

# the full set of package managers to run against
allManagers="npm@6,npm@7,yarn,pnpm"
# the benchmark names
allBenchmarks="clean,lock-only,cache-only,cache-only:legacy-peer-deps,modules-only,no-lock,no-cache,no-modules,no-clean,no-clean:audit"
# a list of all fixtures contained in the repo, comma separated
allFixtures=$(find ./fixtures -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | xargs | sed 's/ /,/g')

print_help () {
  echo ""
  echo "usage:"
  echo "  benchmark.sh [-h] [-m <package managers>] [-b <benchmarks>] [-f <fixtures>]"
  echo ""
  echo "options:"
  echo "  -h   show usage information"
  echo "  -m   comma separated list of package managers, defaults to \"all\""
  echo "  -b   comma separated list of benchmarks, defaults to \"all\""
  echo "  -f   comma separated list of fixtures, defaults to \"all\""
  echo "  -r   generate a report. when run in a github action will also post the report to the relevant pull request"
  echo ""
}

managers=""
benchmarks=""
fixtures=""
output="--style basic"
save=""
report="no"

while getopts "hvsrm:b:f:" arg; do
  case "$arg" in
    h)
      print_help
      exit 0
      ;;
    v)
      output="--show-output"
      ;;
    s)
      save="--export-json $OPTARG"
      ;;
    r)
      report="yes"
      save="--export-json results/temp/results.json"
      ;;
    m)
      managers="$OPTARG"
      ;;
    b)
      benchmarks="$OPTARG"
      ;;
    f)
      fixtures="$OPTARG"
      ;;
    *)
      print_help
      exit 1
      ;;
  esac
done

[ "$managers" = "" ] || [ "$managers" = "all" ] && managers="$allManagers"
[ "$benchmarks" = "" ] || [ "$benchmarks" = "all" ] && benchmarks="$allBenchmarks"
[ "$fixtures" = "" ] || [ "$fixtures" = "all" ] && fixtures="$allFixtures"

echo "pre-installing package managers..."
npm ci --no-fund --no-audit --no-progress --loglevel=error
echo "$managers" | sed -n 1'p' | tr ',' '\n' | while read manager; do
  name=${manager%%@*}
  spec=${manager#*@}
  [ "$spec" = "" ] || [ "$spec" = "$name" ] && spec="latest"
  if [[ "$spec" =~ \#pull/([0-9]+)/head ]]; then
    slug=${name}_pull${BASH_REMATCH[1]}
    # here we can pass the spec as-is, because it's a git reference which will alias neatly on its own
    pkg=${slug}@${spec}
  else
    slug=${name}${spec////_}
    # whereas here we use an explicit npm: styled alias
    pkg=${slug}@npm:${name}@${spec}
  fi

  if [ "$slug" != "npm6" -a "$slug" != "npm7" -a "$slug" != "yarnlatest" -a "$slug" != "pnpmlatest" ]; then
    echo "installing $name as $pkg"
    npm install --no-fund --no-audit --no-save --no-progress --loglevel=error $pkg
  fi
done
echo "installed versions:"
echo "  npm6 -- `./node_modules/npm6/bin/npm-cli.js --version`"
echo "  npm7 -- `./node_modules/npm7/bin/npm-cli.js --version`"
echo "  yarn -- `./node_modules/yarn/bin/yarn.js --version`"
echo "  pnpm -- `./node_modules/pnpm/bin/pnpm.js --version`"
echo ""

echo "starting benchmarks..."
echo "  package managers: $managers"
echo "  benchmarks: $benchmarks"
echo "  fixtures: $fixtures"
echo ""

mkdir -p results/temp

result=0
if hyperfine $output \
  --ignore-failure \
  $save \
  --warmup 1 \
  --runs 2 \
  --parameter-list benchmark "$benchmarks" \
  --parameter-list fixture "$fixtures" \
  --parameter-list manager "$managers" \
  --prepare './prepare.sh {manager} {benchmark} {fixture}' \
  './execute.sh {manager} {benchmark} {fixture}'; then

  if [ "$report" = "yes" ]; then
    node report.js "$managers"
  fi
else
  result=$?
  echo "failed!"
fi

./cleanup.sh
exit $result
