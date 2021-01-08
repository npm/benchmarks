#!/usr/bin/env bash

find fixtures -name '.prepared*' -exec rm -rf {} \; >/dev/null 2>&1
find fixtures -name '*.temp' -exec rm -rf {} \; >/dev/null 2>&1
find fixtures -name 'cache' -exec rm -rf {} \; >/dev/null 2>&1
find fixtures -name 'node_modules' -exec rm -rf {} \; >/dev/null 2>&1
find fixtures -name 'package-lock.json' -exec rm -rf {} \; >/dev/null 2>&1
find fixtures -name 'yarn.lock' -exec rm -rf {} \; >/dev/null 2>&1
find fixtures -name 'pnpm-lock.yaml' -exec rm -rf {} \; >/dev/null 2>&1
true
