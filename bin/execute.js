#!/usr/bin/env node

const { spawnSync } = require('child_process')
const { execute } = require('../lib/argv.js')
const benchmarks = require('../lib/benchmarks.js')

let argv
let args
try {
  argv = execute(process.argv)
  args = benchmarks[argv.benchmark].args(argv)
} catch (err) {
  return process.exit(err.code ?? /* istanbul ignore next */ 1)
}

const executeBenchmark = spawnSync(argv.bin, args, {
  cwd: argv.cwd,
  stdio: 'inherit',
})
if (executeBenchmark.status || executeBenchmark.error) {
  process.exit(execute.status || 1)
}
