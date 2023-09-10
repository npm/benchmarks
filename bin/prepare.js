#!/usr/bin/env node

const fs = require('fs')
const { resolve } = require('path')
const { prepare } = require('../lib/argv.js')
const benchmarks = require('../lib/benchmarks.js')

const argv = prepare(process.argv)
const prepareBenchmark = benchmarks[argv.benchmark].prepare

fs.mkdirSync(argv.cwd, { recursive: true })
fs.copyFileSync(argv.fixturePath, resolve(argv.cwd, 'package.json'))

// prepare is optional for a benchmark
if (prepareBenchmark) {
  prepareBenchmark(argv)
}
