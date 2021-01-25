const { readFileSync: readFile } = require('fs')
const { resolve } = require('path')

// returns an object where the top level keys are the name of the fixtures
// the next level is the name of the benchmarks
// and the final level is the slug of the package manager
// with the innermost value containing the timing data for that run
const parseResults = () => {
  const contents = readFile(resolve(__dirname, '../results/temp/results.json'), { encoding: 'utf8' })
  const parsed = JSON.parse(contents)
  const results = {}

  for (const result of parsed.results) {
    const { manager, fixture, benchmark } = result.parameters

    if (!Object.prototype.hasOwnProperty.call(results, fixture))
      results[fixture] = {}

    if (!Object.prototype.hasOwnProperty.call(results[fixture], benchmark))
      results[fixture][benchmark] = {}

    // if result.mean is less than 10ms then the command isn't supported
    // this is our only means of determining if that's the case until
    // https://github.com/sharkdp/hyperfine/pull/342 lands in a release
    if (result.mean > 0.1) {
      results[fixture][benchmark][manager] = {
        mean: result.mean,
        stddev: result.stddev,
        times: result.times
      }
    } else {
      results[fixture][benchmark][manager] = false
    }
  }

  return results
}


module.exports = parseResults
