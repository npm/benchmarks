const fs = require('fs')
const { basename } = require('path')
const DIR = require('./dirs.js')

const toKey = str => str.toUpperCase().replace(/-/g, '_')

const createAssertion = (name, obj, arr) => (k) => {
  if (k in obj) {
    return
  }
  throw new Error(`Invalid ${name} ${k}. Must be one of ${arr.join(',')}`)
}

const create = (name, values) => {
  const singular = name.slice(0, -1)
  const constants = {}
  const obj = {}

  for (const key of values) {
    constants[toKey(key)] = key
    obj[key] = key
  }

  return {
    // benchmarks
    [name]: values,
    // BENCHMARKS
    [name.toUpperCase()]: constants,
    // validateBenchmarks
    [`validate${singular.charAt(0).toUpperCase()}${singular.slice(1)}`]:
      createAssertion(singular, obj, values),
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

module.exports = {
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
