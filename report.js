#!/usr/bin/env node

const { Octokit } = require('@octokit/rest')

const { readFileSync: readFile } = require('fs')
const { join } = require('path')

const parseResults = () => {
  const contents = readFile('./results/temp/results.json', 'utf8')
  const parsed = JSON.parse(contents)
  const results = {}

  for (const result of parsed.results) {
    const { manager, fixture, benchmark } = result.parameters

    if (!Object.prototype.hasOwnProperty.call(results, manager))
      results[manager] = {}

    if (!Object.prototype.hasOwnProperty.call(results[manager], fixture))
      results[manager][fixture] = {}

    // if result.mean is less than 10ms then the command isn't supported
    // this is our only means of determining if that's the case until
    // https://github.com/sharkdp/hyperfine/pull/342 lands in a release
    if (result.mean > 0.01) {
      results[manager][fixture][benchmark] = {
        mean: result.mean,
        stddev: result.stddev,
        times: result.times
      }
    } else {
      results[manager][fixture][benchmark] = false
    }
  }

  return results
}

const parseName = (name) => {
  const match = /pull\/(\d+)/.exec(name)
  if (match)
    return `#${match[1]}`

  return name
}

const generateTable = (results, fixture, latestManager, currentManager) => {
  const table = []
  const benchmarks = Object.keys(results[latestManager][fixture])
  const benchmarkNames = benchmarks.map(key => key.replace(':', '<br/>'))

  table.push(`|**${fixture}**|${benchmarkNames.join('|')}|`)
  table.push(`|${new Array(benchmarks.length + 1).fill('---').join('|')}|`)

  const latestResults = benchmarks.map(benchmark => {
    const timings = results[latestManager][fixture][benchmark]
    if (!timings)
      return 'N/A'

    return `${timings.mean.toFixed(3)} ±${timings.stddev.toFixed(2)}`
  })
  table.push(`|${parseName(latestManager)}|${latestResults.join('|')}|`)

  const currentResults = benchmarks.map(benchmark => {
    const timings = results[currentManager][fixture][benchmark]
    if (!timings)
      return 'N/A'

    return `${timings.mean.toFixed(3)} ±${timings.stddev.toFixed(2)}`
  })
  table.push(`|${parseName(currentManager)}|${currentResults.join('|')}|`)

  return table.join('\n')
}

const isStatisticallyFaster = (latest, current) => {
  return current.mean + current.stddev < latest.mean - latest.stddev && current.mean / latest.mean < 0.90
}

const isStatisticallySlower = (latest, current) => {
  return current.mean - current.stddev > latest.mean + latest.stddev && latest.mean / current.mean < 0.90
}

const generateChangeReport = (results, latestManager, currentManager) => {
  const latest = results[latestManager]
  const current = results[currentManager]

  const tables = []
  const slower = {}
  const faster = {}
  let foundSlower = 0
  let foundFaster = 0

  for (const fixture in latest) {
    if (!current[fixture])
      continue

    tables.push(generateTable(results, fixture, latestManager, currentManager))

    for (const benchmark in latest[fixture]) {
      if (!latest[fixture][benchmark] || !current[fixture][benchmark])
        continue

      if (isStatisticallyFaster(latest[fixture][benchmark], current[fixture][benchmark])) {
        if (!Array.isArray(faster[fixture]))
          faster[fixture] = []

        foundFaster += 1
        faster[fixture].push(benchmark)
      }

      if (isStatisticallySlower(latest[fixture][benchmark], current[fixture][benchmark])) {
        if (!Array.isArray(slower[fixture]))
          slower[fixture] = []

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
      header += `found ${foundFaster} benchmarks with statistically significant performance improvements\n`
      for (const fixture in faster) {
        header += `- **${fixture}**: ${faster[fixture].join(', ')}\n`
      }
    }

    if (foundSlower) {
      if (foundFaster)
        header += '\n'

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

const postComment = async () => {
  console.log('writing report to pull request')
  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  try {
    const comments = await octokit.paginate(octokit.issues.listComments, {
      owner: OWNER,
      repo: REPO,
      issue_number: PR_ID
    })
    const updateComment = comments.find((comment) => comment.user.login === 'npm-deploy-user')

    if (updateComment) {
      await octokit.issues.updateComment({
        owner: OWNER,
        repo: REPO,
        comment_id: updateComment.id,
        body: report
      })
    } else {
      await octokit.issues.createComment({
        owner: OWNER,
        repo: REPO,
        issue_number: PR_ID,
        body: report
      })
    }
  } catch (err) {
    console.error(err.stack)
    process.exitCode = 1
  }
}

if (process.argv.length !== 3) {
  console.error('usage: report.js <latest>,<current>')
  console.error('  NOTE: the parameters are comma separated, not spaces!')
  console.error('  <latest>  the published release used as a baseline, typically npm@7')
  console.error('  <current> the changes you wish to compare, generally this will be a pull request ref')
  console.error('            such as npm@npm/cli#pull/1234/head')
  process.exit(1)
}

const results = parseResults()
const [latest, current] = process.argv[2].split(',')
// first arg is the "latest" published release
// second arg is the "current" version, typically a ref to a pull request
const report = generateChangeReport(results, latest, current)
console.log(report)

const { PR_ID, REPO, OWNER, GITHUB_TOKEN } = process.env
if (PR_ID && REPO && OWNER && GITHUB_TOKEN)
  postComment()
