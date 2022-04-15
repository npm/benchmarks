const parseName = (name) => {
  const match = /pull\/(\d+)/.exec(name)
  if (match) {
    return `#${match[1]}`
  }

  return name
}

const generateTable = (results, fixture, previousManager, currentManager) => {
  const table = []
  const benchmarks = Object.keys(results[fixture])
  const benchmarkNames = benchmarks.map(key => key.replace(':', '<br/>'))

  table.push(`|**${fixture}**|${benchmarkNames.join('|')}|`)
  table.push(`|${new Array(benchmarks.length + 1).fill('---').join('|')}|`)

  const latestResults = benchmarks.map(benchmark => {
    const timings = results[fixture][benchmark][previousManager.slug]
    if (!timings) {
      return 'N/A'
    }

    return `${timings.mean.toFixed(3)} ±${timings.stddev.toFixed(2)}`
  })
  table.push(`|${parseName(previousManager.name)}|${latestResults.join('|')}|`)

  const currentResults = benchmarks.map(benchmark => {
    const timings = results[fixture][benchmark][currentManager.slug]
    if (!timings) {
      return 'N/A'
    }

    return `${timings.mean.toFixed(3)} ±${timings.stddev.toFixed(2)}`
  })
  table.push(`|${parseName(currentManager.name)}|${currentResults.join('|')}|`)

  return table.join('\n')
}

const isStatisticallyFaster = (previous, current) => {
  return current.mean + current.stddev < previous.mean - previous.stddev
    && current.mean / previous.mean < 0.90
}

const isStatisticallySlower = (previous, current) => {
  return current.mean - current.stddev > previous.mean + previous.stddev
    && previous.mean / current.mean < 0.90
}

const generateChangeReport = (results, previousManager, currentManager) => {
  const tables = []
  const slower = {}
  const faster = {}
  let foundSlower = 0
  let foundFaster = 0

  for (const fixture in results) {
    tables.push(generateTable(results, fixture, previousManager, currentManager))
    for (const benchmark in results[fixture]) {
      const previous = results[fixture][benchmark][previousManager.slug]
      const current = results[fixture][benchmark][currentManager.slug]

      if (!previous || !current) {
        continue
      }

      if (isStatisticallyFaster(previous, current)) {
        if (!Array.isArray(faster[fixture])) {
          faster[fixture] = []
        }

        foundFaster += 1
        faster[fixture].push(benchmark)
      }

      if (isStatisticallySlower(previous, current)) {
        if (!Array.isArray(slower[fixture])) {
          slower[fixture] = []
        }

        foundSlower += 1
        slower[fixture].push(benchmark)
      }
    }
  }

  let header = ''
  if (foundFaster === 0 && foundSlower === 0) {
    header = 'no statistically significant performance changes detected\n'
  } else {
    if (foundFaster) {
      // eslint-disable-next-line max-len
      header += `found ${foundFaster} benchmarks with statistically significant performance improvements\n`
      for (const fixture in faster) {
        header += `- **${fixture}**: ${faster[fixture].join(', ')}\n`
      }
    }

    if (foundSlower) {
      if (foundFaster) {
        header += '\n'
      }

      // eslint-disable-next-line max-len
      header += `found ${foundSlower} benchmarks with statistically significant performance regressions\n`
      for (const fixture in slower) {
        header += `- **${fixture}**: ${slower[fixture].join(', ')}\n`
      }
    }
  }

  return `${header}
<details><summary>timing results</summary>

${tables.join('\n\n')}
</details>`
}

module.exports = generateChangeReport
