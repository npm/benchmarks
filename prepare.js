#!/usr/bin/env node

const { copyFileSync: copyFile, mkdirSync: mkdir, existsSync: exists, renameSync: rename } = require('fs')
const { resolve } = require('path')
const utils = require('./lib/utils.js')

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
mkdir(dir, { recursive: true })

const fixturePath = resolve(__dirname, 'fixtures', `${argv.fixture}.json`)
copyFile(fixturePath, resolve(dir, 'package.json'))

switch (benchmark) {
  case 'clean':
    utils.remove(dir, [
      'cache',
      'node_modules',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ])
    break
  case 'lock-only':
    utils.remove(dir, [
      'cache',
      'node_modules',
    ])

    utils.restore(dir, [
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ])
    break
  case 'cache-only':
    utils.remove(dir, [
      'node_modules',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ])

    utils.restore(dir, [
      'cache',
    ])
    break
  case 'modules-only':
    utils.remove(dir, [
      'cache',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ])

    utils.restore(dir, [
      'node_modules',
    ])
    break
  case 'no-lock':
    utils.remove(dir, [
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ])

    utils.restore(dir, [
      'cache',
      'node_modules',
    ])
    break
  case 'no-cache':
    utils.remove(dir, [
      'cache',
    ])

    utils.restore(dir, [
      'node_modules',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ])
    break
  case 'no-modules':
    utils.remove(dir, [
      'node_modules',
    ])

    utils.restore(dir, [
      'cache',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ])
    break
  case 'no-clean':
    utils.restore(dir, [
      'cache',
      'node_modules',
      'package-lock.yaml',
      'yarn.lock',
      'pnpm-lock.yaml',
    ])
    break
}
