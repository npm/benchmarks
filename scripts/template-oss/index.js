module.exports = {
  rootRepo: {
    add: {
      '.github/workflows/benchmark-cli.yml': 'benchmark-cli.yml',
      '.github/workflows/benchmark-manual.yml': 'benchmark-manual.yml',
    },
  },
  lockfile: true,
  windowsCI: false,
  macCI: false,
  ciVersions: 'latest',
}
