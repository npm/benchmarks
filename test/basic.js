const t = require('tap')
const { run, downloadManagers } = require('./fixtures/setup.js')

t.before(() => {
  downloadManagers(['npm@latest', 'yarn@latest', 'pnpm@latest'])
})

t.test('cant use report with more than 2 managers', t => {
  const res = run({
    managers: ['npm@latest', 'yarn@latest', 'pnpm@latest'],
    args: ['--report', '--clean-managers=false'],
  })
  t.equal(res.status, 1)
  t.end()
})

t.test('can alias all', t => {
  const res = run({
    managers: ['all'],
    benchmarks: ['all'],
    fixtures: ['all'],
    // just make it exit for coverage so we dont actually run everything which
    // will take awhile
    args: ['--download-only', '--clean-managers=false'],
  })
  t.equal(res.status, 0)
  t.end()
})

t.test('cant use unsupported manager', t => {
  const res = run({
    managers: ['abbrev@latest'],
  })
  t.equal(res.status, 1)
  t.end()
})

t.test('cant use invalid manager', t => {
  const res = run({
    managers: ['npm@999.999.999'],
  })
  t.equal(res.status, 1)
  t.end()
})
