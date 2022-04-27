const t = require('tap')
const { resolve, join } = require('path')
const { spawnSync: spawn } = require('child_process')
const { sync: rimraf } = require('rimraf')
const { existsSync } = require('fs')
const { sync: which } = require('which')

const root = resolve(__dirname, '..')
const resultsDir = resolve(root, 'results')

t.before(() => {
  if (!which('hyperfine', { nothrow: true })) {
    spawn('brew', ['install', 'hyperfine'])
  }
})

t.beforeEach(() => rimraf(resultsDir))

t.test('basic', async t => {
  t.notOk(existsSync(resultsDir))

  const res = spawn('./bin/benchmark.js', [
    '-m',
    'npm@8.6.0',
    'npm@8.7.0',
    '-f',
    '_test',
    '-b',
    'clean',
    '-r',
    '-g',
  ], { encoding: 'utf-8', cwd: root })

  const { results } = require(join(resultsDir, 'temp', 'results.json'))
  t.ok(results.every((run) => run.exit_codes.every((code) => code === 0)))
  t.equal(res.status, 0)
})
