const parseName = (name) => {
  const match = name.match(/pull\/(\d+)/)
  /* istanbul ignore next */
  return match ? `#${match[1]}` : name
}

const parseTimings = (timings) => {
  if (!timings) {
    return 'Not Supported'
  }
  if (timings.error) {
    return `Error: ${timings.error}`
  }
  return `${timings.mean.toFixed(3)} ±${timings.stddev.toFixed(2)}`
}

const generateTable = (results, fixture, previousManager, currentManager) => {
  const table = []
  const benchmarks = Object.keys(results[fixture])
  const benchmarkNames = benchmarks.map(key => key.replace(':', '<br/>'))

  table.push(`|**${fixture}**|${benchmarkNames.join('|')}|`)
  table.push(`|${new Array(benchmarks.length + 1).fill('---').join('|')}|`)

  const latestResults = benchmarks.map(benchmark => {
    return parseTimings(results[fixture][benchmark][previousManager.slug])
  })
  table.push(`|${parseName(previousManager.name)}|${latestResults.join('|')}|`)

  const currentResults = benchmarks.map(benchmark => {
    return parseTimings(results[fixture][benchmark][currentManager.slug])
  })
  table.push(`|${parseName(currentManager.name)}|${currentResults.join('|')}|`)

  return table.join('\n')
}

const generateTableHtml = (results, previousManager, currentManager) => {
  const tables = []

  for (const fixture in results) {
    tables.push(generateTable(results, fixture, previousManager, currentManager))
  }

  return `<details><summary>timing results</summary>\n\n${tables.join('\n\n')}\n</details>`
}

/* istanbul ignore next */
const isStatisticallyFaster = (previous, current) => {
  return current.mean + current.stddev < previous.mean - previous.stddev
    && current.mean / previous.mean < 0.90
}

/* istanbul ignore next */
const isStatisticallySlower = (previous, current) => {
  return current.mean - current.stddev > previous.mean + previous.stddev
    && previous.mean / current.mean < 0.90
}

const generateHeader = (results, previousManager, currentManager) => {
  const slower = { count: 0, benchmarks: {} }
  const faster = { count: 0, benchmarks: {} }
  const errors = { count: 0, benchmarks: {} }

  for (const fixture in results) {
    for (const benchmark in results[fixture]) {
      const previous = results[fixture][benchmark][previousManager.slug]
      const current = results[fixture][benchmark][currentManager.slug]

      // this check needs to come first because we want to always report
      // unexpected command failures
      if (previous?.error || current?.error) {
        errors.count++
        errors.benchmarks[fixture] ??= []
        errors.benchmarks[fixture].push(benchmark)
        continue
      }

      // otherwise if either command is N/A then we can measure timings so skip
      if (!previous || !current) {
        continue
      }

      // TODO: mock tests to create faster/slower runs
      /* istanbul ignore next */
      if (isStatisticallyFaster(previous, current)) {
        faster.count++
        faster.benchmarks[fixture] ??= []
        faster.benchmarks[fixture].push(benchmark)
      } else if (isStatisticallySlower(previous, current)) {
        slower.count++
        slower.benchmarks[fixture] ??= []
        slower.benchmarks[fixture].push(benchmark)
      }
    }
  }

  let h = ''
  const header = (msg) => h += `\n${msg}`
  const section = (count, message) => header(`found ${count} benchmarks with ${message}`)

  if (errors.count) {
    const { count, benchmarks } = errors
    section(count, 'unexpected errors')
    for (const [fixture, names] of Object.entries(benchmarks)) {
      header(`- **${fixture}**: ${names.join(', ')}`)
    }
  }

  /* istanbul ignore next */
  if (faster.count) {
    const { count, benchmarks } = faster
    section(count, 'statistically significant performance improvements')
    for (const [fixture, names] of Object.entries(benchmarks)) {
      header(`- **${fixture}**: ${names.join(', ')}`)
    }
  }

  /* istanbul ignore next */
  if (slower.count) {
    const { count, benchmarks } = slower
    section(count, 'statistically significant performance regressions')
    for (const [fixture, names] of Object.entries(benchmarks)) {
      header(`- **${fixture}**: ${names.join(', ')}`)
    }
  }

  return h ? h.trim() : 'no statistically significant performance changes detected'
}

module.exports = (results, previousManager, currentManager) => {
  const header = generateHeader(results, previousManager, currentManager)
  const table = generateTableHtml(results, previousManager, currentManager)
  return `${header}\n${table}`
}
