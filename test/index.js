const t = require('tap')
const fs = require('fs')
const { resolve, join } = require('path')
const { spawnSync: spawn } = require('child_process')
const { sync: which } = require('which')

const DIR = require('../lib/dirs.js')
const parseResults = require('../lib/parse-result.js')

const root = resolve(__dirname, '..')

const benchmark = (t, {
  before = false,
  managers = ['npm@8', 'npm@9', 'npm@10', 'npm@latest', 'yarn@latest', 'pnpm@latest'],
  fixtures = ['empty'],
  benchmarks = ['clean'],
  args = [],
} = {}) => {
  const res = spawn('./bin/benchmark.js', [
    '--show-output',
    '--clean-managers=false',
    ...before ? ['--download-only'] : [],
    ...managers.flatMap((m) => ['-m', m]),
    ...fixtures.flatMap((f) => ['-f', f]),
    ...benchmarks.flatMap((b) => ['-b', b]),
    ...args,
  ], { encoding: 'utf-8', cwd: root })

  if (res.status !== 0) {
    const msg = `Failed with status:${res.status}\n${res.output.filter(Boolean).join('\n')}`
    if (t) {
      t.fail(msg)
      return t.end()
    } else {
      throw new Error(msg)
    }
  }

  return {
    results: before ? null : parseResults(),
    files: fs.readdirSync(DIR.results).reduce((acc, p) => {
      if (p === 'results.json') {
        return acc
      }
      acc[p] = fs.readFileSync(join(DIR.results, p), { encoding: 'utf-8' })
      return acc
    }, {}),
  }
}

t.before(() => {
  which('hyperfine')
  benchmark(t, { before: true })
})

t.test('npm 9->latest with report', t => {
  const res = benchmark(t, {
    managers: ['npm@9', 'npm@latest'],
    args: ['-r', '-g'],
  })
  t.ok(res)
  t.end()
})

t.test('all', t => {
  const res = benchmark(t, {
    benchmarks: ['all'],
    args: ['-g'],
  })
  t.ok(res)
  t.end()
})
