'use strict'

const dedent = require('dedent')

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
        ${resultRows(latestResults, currentResults)}
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
    .map((fixture) => `<th colspan="2">${fixture}</th>`)
    .join('\n')
}

function subTableHeader (results) {
  const scenarioKeys = Object.keys(results)
  const fixtures = Object.keys(results[scenarioKeys[0]])

  return fixtures
    .map((fixture) => dedent`
      <th>prev</th>
      <th>current</th>
    `)
    .join('\n')
}

function resultRows (latest, current) {
  const scenarioKeys = Object.keys(current)
  const fixtureKeys = Object.keys(current[scenarioKeys[0]])
  return scenarioKeys
    .map((scenarioKey) => dedent`
      <tr>
        <td>${scenarioKey}</td>
        ${fixtureKeys.map((fixtureKey) => dedent`
            <td>${latest[scenarioKey][fixtureKey] / 1000}s</td>
            <td>${current[scenarioKey][fixtureKey] / 1000}s</td>
          `).join('\n')}
      </tr>
    `)
    .join('\n')
}

// style="color: #00B200" // green
// style="color: #A00000" // red
