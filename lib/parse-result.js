const fs = require('fs')
const { join } = require('path')
const DIR = require('./dirs.js')
const { UNSUPPORTED_CODE } = require('./options.js')

const readResults = () => {
  const raw = fs.readFileSync(join(DIR.results, 'results.json'), { encoding: 'utf-8' })
  return JSON.parse(raw).results
}

// returns an object where the top level keys are the name of the fixtures
// the next level is the name of the benchmarks
// and the final level is the slug of the package manager
// with the innermost value containing the timing data for that run
const parseResults = () => {
  const parsed = readResults()

  const res = {}
  for (const result of parsed) {
    const {
      mean,
      stddev,
      times,
      exit_codes: exitCodes,
      parameters: { manager, fixture, benchmark },
    } = result

    const unsupported = exitCodes.every(c => c === UNSUPPORTED_CODE)
    const ok = exitCodes.every(c => c === 0)

    res[fixture] ??= {}
    res[fixture][benchmark] ??= {}
    res[fixture][benchmark][manager] =
      unsupported ? null :
      ok ? { mean, stddev, times } :
      { error: 'Command failed' }
  }

  return res
}

module.exports = parseResults
module.exports.readResults = readResults
