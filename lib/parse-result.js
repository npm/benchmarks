const fs = require('fs')
const { join } = require('path')
const DIR = require('./dirs.js')

const readJson = (p) => JSON.parse(fs.readFileSync(p, { encoding: 'utf-8' }))

// returns an object where the top level keys are the name of the fixtures
// the next level is the name of the benchmarks
// and the final level is the slug of the package manager
// with the innermost value containing the timing data for that run
const parseResults = () => {
  const parsed = readJson(join(DIR.results, 'results.json')).results

  const res = {}
  for (const result of parsed) {
    const {
      mean,
      stddev,
      times,
      exit_codes: exitCodes,
      parameters: { manager, fixture, benchmark },
    } = result

    const exitCode = exitCodes.pop()

    res[fixture] ??= {}
    res[fixture][benchmark] ??= {}
    res[fixture][benchmark][manager] =
      exitCode === 100 ? null :
      exitCode !== 0 ? { error: 'Command failed unexpectedly' } :
      { mean, stddev, times }
  }

  return res
}

module.exports = parseResults
