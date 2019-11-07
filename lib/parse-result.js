'use strict'

const dedent = require('dedent')
const prettyMs = require('pretty-ms')

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
  const status = (current <= latest) ? '✅' : '🛑'
  return `<td>${prettyMs(current)}</td><td>${status}</td>`
}
