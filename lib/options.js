const fs = require('fs')
const { basename } = require('path')
const DIR = require('./dirs.js')

const toKey = str => str.toUpperCase().replace(/-/g, '_')

const create = (name, values) => {
  const constants = {}
  const set = new Set()

  for (const key of values) {
    constants[toKey(key)] = key
    set.add(key)
  }

  return {
    // benchmarks
    [name]: values,
    // BENCHMARKS
    [name.toUpperCase()]: constants,
    // benchmarksSet
    [`${name}Set`]: set,
  }
}

const benchmarks = create('benchmarks', [
  'clean',
  'lock-only',
  'cache-only',
  'modules-only',
  'no-lock',
  'no-cache',
  'no-modules',
  'no-clean',
  'show-version',
  'run-script',
])

const flags = create('flags', [
  'default',
  'peer-deps',
  'audit',
])

benchmarks.benchmarks.push(
  `${benchmarks.BENCHMARKS.CACHE_ONLY}:${flags.FLAGS.PEER_DEPS}`,
  `${benchmarks.BENCHMARKS.NO_CLEAN}:${flags.FLAGS.AUDIT}`
)

const UNSUPPORTED_CODE = 100
const UNSUPPORTED_ERROR = (msg) => Object.assign(new Error(`Unsupported: ${msg}`), {
  name: 'UnsupportedCommandError',
  code: UNSUPPORTED_CODE,
})

module.exports = {
  UNSUPPORTED_ERROR,
  UNSUPPORTED_CODE,
  ...benchmarks,
  ...flags,
  ...create('managers', [
    'npm',
    'yarn',
    'pnpm',
  ]),
  ...create('fixtures', fs.readdirSync(DIR.fixtures)
    .filter(f => f.endsWith('.json'))
    .map(f => basename(f, '.json'))),
}
