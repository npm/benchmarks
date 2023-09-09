#!/usr/bin/env node

const { spawnSync } = require('child_process')
const getArgv = require('../lib/argv.js')
const benchmarks = require('../lib/benchmarks.js')

const argv = getArgv(process.argv)
const benchmark = benchmarks[argv.benchmark]

let args = []
try {
  args = benchmark.args(argv)
} catch (err) {
  process.exitCode = err.name === 'UnsupportedCommandError' ? 100 : 1
  throw err
}

process.exitCode = spawnSync(argv.bin, args, {
  cwd: argv.cwd,
  stdio: 'inherit',
}).status
