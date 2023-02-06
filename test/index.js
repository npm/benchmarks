const t = require('tap')
const { resolve, join } = require('path')
const { spawnSync: spawn } = require('child_process')
const { existsSync, rmSync } = require('fs')
const { sync: which } = require('which')

const rimraf = (p) => rmSync(p, { recursive: true, force: true })

const root = resolve(__dirname, '..')
const resultsDir = resolve(root, 'results')

t.before(() => which('hyperfine'))
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
    '--loglevel=silly',
  ], { encoding: 'utf-8', cwd: root, stdio: 'inherit' })

  const { results } = require(join(resultsDir, 'temp', 'results.json'))
  t.ok(results.every((run) => run.exit_codes.every((code) => code === 0)))
  t.equal(res.status, 0)
})
