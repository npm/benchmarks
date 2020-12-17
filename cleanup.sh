#!/usr/bin/env bash

find . -name '*.temp' -exec rm -rf {} \; >/dev/null 2>&1
find . -name 'package-lock.json' -exec rm -rf {} \; >/dev/null 2>&1
find . -name 'node_modules' -exec rm -rf {} \; >/dev/null 2>&1
find . -name 'cache' -exec rm -rf {} \; >/dev/null 2>&1
true
