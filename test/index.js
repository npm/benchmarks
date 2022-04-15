const t = require('tap')
const { resolve } = require('path')
const { spawnSync: spawn } = require('child_process')

const root = resolve(__dirname, '..')

t.test('basic', async t => {
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

  t.equal(res.status, 0)
})
