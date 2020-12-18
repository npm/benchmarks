#!/usr/bin/env bash

set -euo pipefail

# the full set of package managers to run against
allManagers="npm@6,npm@7,yarn@latest,pnpm@latest"
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
  echo ""
}

managers=""
benchmarks=""
fixtures=""
output="--style basic"
save=""

while getopts "hvsm:b:f:" arg; do
  case "$arg" in
    h)
      print_help
      exit 0
      ;;
    v)
      output="--show-output"
      ;;
    s)
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

  if [ "$save" != "" ]; then
    echo "saving results..."
  fi
else
  result=$?
  echo "failed!"
fi

./cleanup.sh
exit $result
