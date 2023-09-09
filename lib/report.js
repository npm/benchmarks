const parseName = (name) => {
  const match = /pull\/(\d+)/.exec(name)
  if (match) {
    return `#${match[1]}`
  }

  return name
}

const parseTimings = (timings) => timings || null

const generateTimings = (_timings) => {
  const timings = parseTimings(_timings)
  if (!timings) {
    return 'N/A'
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
    return generateTimings(results[fixture][benchmark][previousManager.slug])
  })
  table.push(`|${parseName(previousManager.name)}|${latestResults.join('|')}|`)

  const currentResults = benchmarks.map(benchmark => {
    return generateTimings(results[fixture][benchmark][currentManager.slug])
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

const isStatisticallyFaster = (previous, current) => {
  return current.mean + current.stddev < previous.mean - previous.stddev
    && current.mean / previous.mean < 0.90
}

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
      const previous = parseTimings(results[fixture][benchmark][previousManager.slug])
      const current = parseTimings(results[fixture][benchmark][currentManager.slug])

      if (previous.error || current.error) {
        errors.count++
        errors.benchmarks[fixture] ??= []
        errors.benchmarks[fixture].push(benchmark)
      }

      if (!previous || !current) {
        continue
      }

      if (isStatisticallyFaster(previous, current)) {
        faster.count++
        faster.benchmarks[fixture] ??= []
        faster.benchmarks[fixture].push(benchmark)
      }

      if (isStatisticallySlower(previous, current)) {
        slower.count++
        slower.benchmarks[fixture] ??= []
        slower.benchmarks[fixture].push(benchmark)
      }
    }
  }

  if (!slower.count && !faster.count && !errors.count) {
    return 'no statistically significant performance changes detected'
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

  if (faster.count) {
    const { count, benchmarks } = faster
    section(count, 'statistically significant performance improvements')
    for (const [fixture, names] of Object.entries(benchmarks)) {
      header(`- **${fixture}**: ${names.join(', ')}`)
    }
  }

  if (slower.count) {
    const { count, benchmarks } = slower
    section(count, 'statistically significant performance regressions')
    for (const [fixture, names] of Object.entries(benchmarks)) {
      header(`- **${fixture}**: ${names.join(', ')}`)
    }
  }

  return h.trim()
}

module.exports = (results, previousManager, currentManager) => {
  const header = generateHeader(results, previousManager, currentManager)
  const table = generateTableHtml(results, previousManager, currentManager)
  return `${header}\n${table}`
}
