const { relative } = require('path')
const DIR = require('../../lib/dirs.js')

module.exports = {
  rootRepo: {
    add: {
      '.github/workflows/benchmark-cli.yml': 'benchmark-cli-yml.hbs',
      '.github/workflows/benchmark-manual.yml': 'benchmark-manual-yml.hbs',
    },
  },
  lockfile: true,
  windowsCI: false,
  macCI: false,
  ciVersions: 'latest',
  resultsDir: relative(DIR.root, DIR.results),
}
