'use strict'

const dedent = require('dedent')
const prettyMs = require('pretty-ms')

// Emoji constants
const okay = '✅'
const bad = '🛑'
const slow = '🐌'
const fast = '🔥'

module.exports = function parseResults (latestResults, currentResults) {
  const message = dedent`
    <table>
      <thead>
        <tr>
          <th></th>
          ${tableHeader(currentResults)}
        </tr>
        <tr>
          <th></th>
          ${subTableHeader(currentResults)}
        </tr>
      </thead>
      <tbody>
        ${resultRowsScenario(latestResults, currentResults)}
      </tbody>
    </table>
  `
  return message
}

function tableHeader (results) {
  // INFO: The results are mapped such that top level keys are scenario names
  const scenarioKeys = Object.keys(results)
  /**
   * INFO:
   * The results are mapped such that scenarios all have the same keys,
   * which are the fixtures.
   */
  const fixtures = Object.keys(results[scenarioKeys[0]])

  return fixtures
    .map((fixture) => `<th colspan="3">${fixture}</th>`)
    .join('\n')
}

function subTableHeader (results) {
  const scenarioKeys = Object.keys(results)
  const fixtures = Object.keys(results[scenarioKeys[0]])

  return fixtures
    .map((fixture) => dedent`
      <th>prev</th>
      <th>current</th>
      <th>status</th>
    `)
    .join('\n')
}

function resultRowsScenario (latest, current) {
  const scenarioKeys = Object.keys(current)
  const fixtureKeys = Object.keys(current[scenarioKeys[0]])
  return scenarioKeys
    .map((scenarioKey) => dedent`
      <tr>
        <td>${scenarioKey}</td>
        ${resultRowFixtures(latest, current, scenarioKey, fixtureKeys)}
      </tr>
    `)
    .join('\n')
}

function resultRowFixtures (latest, current, scenarioKey, fixtureKeys) {
  return fixtureKeys
    .map((fixtureKey) => {
      // TODO: if there was no `latest` then this will break
      // NOTE: `_.get()` could fix this
      const latestValue = latest[scenarioKey][fixtureKey]
      const currentValue = current[scenarioKey][fixtureKey]
      return dedent`
        <td>${prettyMs(latestValue)}</td>
        ${colorResult(latestValue, currentValue)}
      `
    })
    .join('\n')
}

function colorResult (latest, current) {
  return `<td>${prettyMs(current)}</td><td>${getStatus(latest, current)}</td>`
}

function getStatus (latest, current) {
  const accValueInc = acceptableValueIncrease(latest)
  const accPercentInc = acceptablePercentIncrease(latest)

  const min = Math.min(accValueInc, accPercentInc)
  const max = Math.max(accValueInc, accPercentInc)

  if (latest < current) {
    // NOTE: things got slower
    if (current <= min) {
      // acceptable
      return `${okay}`
    } else if (current > min && current <= max) {
      // slow
      return `${okay}${slow}`
    } else if (current > max) {
      // really bad
      return `${bad}`
    }
  } else {
    // NOTE: things got faster
    if (current <= max) {
      // faster
      return `${okay}`
    } else if (current > max) {
      // really fast; good job
      return `${fast}`
    }
  }
}

function acceptableValueIncrease (latest) {
  // 1.5% of the latest value
  const threshold = Math.round(latest * 0.015)

  // Add _arbitrary_ 1 second (1000ms)
  return threshold + 1000
}

function acceptablePercentIncrease (latest) {
  // Yields 10% change
  return (latest * 10) / 9
}
