'use strict'

const Octokit = require('@octokit/rest')

const {
  safeLoadResults,
  fetchCommandVersion
} = require('./utils')

const parseResults = require('./parse-result')

const { PR_ID, REPO, OWNER, GITHUB_TOKEN } = process.env

module.exports = async function comment () {
  const { suiteCmd, suiteName } = require('./npm-suite')
  const latestFilename = `${suiteName}/latest.json`
  const latestResults = safeLoadResults(latestFilename)

  const version = fetchCommandVersion(suiteCmd)
  const currentFilename = `${suiteName}/${version}.json`
  const currentResults = safeLoadResults(currentFilename)

  // INFO: get the "most recent" current results (last item of the list)
  const output = parseResults(latestResults[0], currentResults[currentResults.length - 1])
  console.log(output)

  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  console.log('PR:', PR_ID) // TESTING
  console.log('REPO:', REPO) // TESTING
  console.log('OWNER:', OWNER) // TESTING
  console.log('TOKEN:', GITHUB_TOKEN) // TESTING

  const options = octokit.issues.listComments.endpoint.merge({
    owner: OWNER,
    repo: REPO,
    issue_number: PR_ID
  })
  const comments = await octokit.paginate(options)
  console.log('COMMENTS:', comments) // TESTING
  const updateComment = comments.find((c) => c.user.login === 'npm-deploy-user')

  if (updateComment) {
    console.log('FOUND COMMENT') // TESTING
    await octokit.issues.updateComment({
      owner: OWNER,
      repo: REPO,
      comment_id: updateComment.id,
      body: output
    })
  } else {
    await octokit.issues.createComment({
      owner: OWNER,
      repo: REPO,
      issue_number: PR_ID,
      body: output
    })
  }
}
