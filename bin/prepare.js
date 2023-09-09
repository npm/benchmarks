#!/usr/bin/env node

const fs = require('fs')
const { resolve } = require('path')
const getArgv = require('../lib/argv.js')
const benchmarks = require('../lib/benchmarks.js')

const argv = getArgv(process.argv)
const benchmark = benchmarks[argv.benchmark]

fs.mkdirSync(argv.cwd, { recursive: true })
fs.copyFileSync(argv.fixturePath, resolve(argv.cwd, 'package.json'))
benchmark.prepare?.(argv)
