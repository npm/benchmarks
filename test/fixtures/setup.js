const { join } = require('path')
const fs = require('fs')
const { spawnSync: spawn } = require('child_process')
const { sync: which } = require('which')
const DIR = require('../../lib/dirs.js')
const parseResults = require('../../lib/parse-result.js')

const run = ({
  managers = [],
  fixtures = ['empty'],
  benchmarks = ['clean'],
  args = [],
} = {}) => {
  const fullArgs = [
    '--show-output',
    ...managers.flatMap((m) => ['-m', m]),
    ...fixtures.flatMap((f) => ['-f', f]),
    ...benchmarks.flatMap((b) => ['-b', b]),
    ...args,
  ]

  return spawn('./bin/benchmark.js', fullArgs, {
    encoding: 'utf-8',
    cwd: DIR.root,
  })
}

const downloadManagers = (managers) => {
  return run({
    managers,
    args: ['--download-only'],
  })
}

const runBenchmark = (t, { args = [], fixtures = ['empty'], benchmarks = ['clean'], ...rest }) => {
  const res = run({
    ...rest,
    fixtures,
    benchmarks,
    // for tests we dont need to cleanup the managers every time since they are
    // not changed during the course of a benchmark. so we use downloadManagers()
    // to cache them all before a test and then set this option to not clean them up
    args: [...args, '--clean-managers=false'],
  })

  if (res.status !== 0) {
    const msg = res.output.filter(Boolean).join('\n')
    return t.fail(`Failed with status:${res.status}\n${msg}`)
  }

  return {
    cmd: res,
    results: parseResults(),
    files: fs.readdirSync(DIR.results).reduce((acc, p) => {
      if (p !== 'results.json') {
        acc[p] = fs.readFileSync(join(DIR.results, p), { encoding: 'utf-8' })
      }
      return acc
    }, {}),
  }
}

const hasHyperfine = () => which('hyperfine')

module.exports = {
  run,
  downloadManagers,
  runBenchmark,
  hasHyperfine,
}
