#!/usr/bin/env node

const { spawnSync: spawn } = require('child_process')
const { resolve } = require('path')
const utils = require('./lib/utils.js')
const semver = require('semver')

const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')

const { argv } = yargs(hideBin(process.argv))
  .option('m', {
    alias: 'manager',
    demandOption: true,
    describe: 'the package manager to prepare',
    type: 'string',
  })
  .option('b', {
    alias: 'benchmark',
    demandOption: true,
    describe: 'the benchmark to prepare',
    type: 'string',
  })
  .option('f', {
    alias: 'fixture',
    demandOption: true,
    describe: 'the fixture to prepare',
    type: 'string',
  })
  .help()

const [benchmark, flag] = argv.benchmark.split(':')
const dir = resolve(__dirname, 'temp', argv.manager, argv.fixture, flag || 'default')

const pkg = utils.getPkg(argv.manager)
const version = semver.parse(pkg.version)
const bin = utils.getBin(argv.manager)
const args = []

switch (pkg.name) {
  case 'npm':
    args.push('install', '--ignore-scripts', '--cache=./cache')
    switch (version.major) {
      case 7:
        switch (flag) {
          case 'audit':
            args.push('--legacy-peer-deps')
            break
          case 'peer-deps':
            break
          default:
            args.push('--no-audit', '--legacy-peer-deps')
        }
        break
      case 6:
        switch (flag) {
          case 'audit':
            break
          case 'peer-deps':
            throw new Error(`unsupported flag ${flag}`)
            break
          default:
            args.push('--no-audit')
        }
        break
      default:
        throw new Error(`unsupported npm version ${version.major}`)
    }
    break
  case 'yarn':
    args.push('--ignore-scripts', '--cache-folder', './cache')
    switch (flag) {
      case 'audit':
        args.push('--audit')
        break
      case 'peer-deps':
        throw new Error(`unsupported flag ${flag}`)
        break
      default:
        break
    }
    break
  case 'pnpm':
    args.push('install', '--ignore-scripts', '--store-dir', './cache')
    switch (flag) {
      case 'audit':
        throw new Error(`unsupported flag ${flag}`)
        break
      case 'peer-deps':
        throw new Error(`unsupported flag ${flag}`)
        break
      default:
        break
    }
    break
  default:
    throw new Error(`unsupported package manager ${pkg.name}`)
}

const result = spawn(bin, args, { stdio: 'inherit', cwd: dir })
process.exitCode = result.status
