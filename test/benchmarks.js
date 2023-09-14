const t = require('tap')
const { runBenchmark, downloadManagers, hasHyperfine } = require('./fixtures/setup.js')

const MANAGERS = [
  'npm@1',
  'npm@6',
  'npm@7',
  'npm@8',
  'npm@9',
  'npm@10',
  'npm@latest',
  'yarn@latest',
  'pnpm@latest',
]

t.cleanSnapshot = (s) => s
  .replace(/±\d\.\d+/g, '±STD_DEV')
  .replace(/\d+\.\d{3,}/g, 'TIME.MS')
  .replace(/width="\d+"/g, 'width="WIDTH"')
  .replace(/fill="#[a-z0-9]+"/g, 'fill="COLOR"')
  .replace(/(Tests run with Node v)[\d.]+/g, '$1VERSION')
  .replace(/>\d+\.\d+\.\d+<\//g, '>X.Y.Z</')

t.before(() => {
  hasHyperfine()
  downloadManagers(MANAGERS)
})

t.test('unsupported', t => {
  t.test('very old npm', t => {
    const res = runBenchmark(t, {
      managers: ['npm@1'],
    })

    t.strictSame(res.results, {
      empty: {
        clean: {
          npm_1: null,
        },
      },
    })

    t.end()
  })

  t.test('flags', t => {
    const res = runBenchmark(t, {
      managers: ['yarn@latest', 'pnpm@latest'],
      benchmarks: ['cache-only:peer-deps', 'no-clean:audit'],
      args: ['--report', '--graph'],
    })

    t.match(res.results, {
      empty: {
        'cache-only:peer-deps': {
          yarn_latest: null,
          pnpm_latest: null,
        },
        'no-clean:audit': {
          yarn_latest: {
            mean: Number,
            stddev: Number,
            times: [Number, Number],
          },
          pnpm_latest: null,
        },
      },
    })

    t.matchSnapshot(res.files['report.md'])
    t.matchSnapshot(res.files['empty.svg'])

    t.end()
  })

  t.end()
})

t.test('errors', t => {
  t.test('basic', t => {
    const res = runBenchmark(t, {
      managers: ['npm@latest', 'yarn@latest', 'pnpm@latest'],
      fixtures: ['error'],
    })

    t.strictSame(res.results, {
      error: {
        clean: {
          npm_latest: { error: 'Command failed' },
          yarn_latest: { error: 'Command failed' },
          pnpm_latest: { error: 'Command failed' },
        },
      },
    })

    t.end()
  })

  t.test('with report/graph', t => {
    const res = runBenchmark(t, {
      managers: ['yarn@latest', 'pnpm@latest'],
      fixtures: ['error'],
      args: ['--report', '--graph'],
    })

    t.matchSnapshot(res.files['report.md'])
    t.matchSnapshot(res.files['error.svg'])

    t.end()
  })

  t.end()
})

t.test('npm', t => {
  t.test('9 vs latest', t => {
    const res = runBenchmark(t, {
      managers: ['npm@9', 'npm@latest'],
      args: ['--report', '--graph'],
    })

    t.matchSnapshot(res.results)
    t.matchSnapshot(res.files['report.md'])
    t.matchSnapshot(res.files['empty.svg'])

    t.end()
  })

  t.test('6 vs latest', t => {
    const res = runBenchmark(t, {
      managers: ['npm@6', 'npm@latest'],
      benchmarks: ['clean', 'cache-only:peer-deps', 'no-clean:audit'],
    })

    t.matchSnapshot(res.results)
    t.matchSnapshot(res.files['report.md'])
    t.matchSnapshot(res.files['empty.svg'])

    t.end()
  })

  t.end()
})

t.test('all', t => {
  t.test('with graph', t => {
    const res = runBenchmark(t, {
      managers: ['npm@latest'],
      benchmarks: ['all'],
      args: ['-g'],
    })

    t.matchSnapshot(res.results, 'results')
    t.matchSnapshot(res.files, 'files')

    t.end()
  })

  t.test('benchmarks', t => {
    const res = runBenchmark(t, {
      managers: ['npm@latest'],
      benchmarks: ['all'],
      fixtures: ['single'],
    })

    t.matchSnapshot(res.results)

    t.end()
  })

  t.end()
})
