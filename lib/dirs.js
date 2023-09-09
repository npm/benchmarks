const { resolve, join } = require('path')

const ROOT = resolve(__dirname, '..')

module.exports = {
  root: ROOT,
  temp: join(ROOT, 'temp'),
  cache: join(ROOT, 'cache'),
  logs: join(ROOT, 'logs'),
  results: join(ROOT, 'results/temp'),
  managers: join(ROOT, 'managers'),
  bin: join(ROOT, 'bin'),
  fixtures: join(ROOT, 'bin', 'fixtures'),
}
