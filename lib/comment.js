'use strict'

const Octokit = require('@octokit/rest')

const {
  log,
  safeLoadResults,
  fetchCommandVersion
} = require('./utils')

const parseResults = require('./parse-result')

const { PR_ID, REPO, OWNER, GITHUB_TOKEN } = process.env

module.exports = async function comment () {
  // TODO: pass in benchmark suite information
  const { suiteCmd, suiteName } = require('./npm-suite')
  const latestFilename = `${suiteName}/latest.json`
  const latestResults = safeLoadResults(latestFilename)

  const version = fetchCommandVersion(suiteCmd)
  const currentFilename = `${suiteName}/${version}.json`
  const currentResults = safeLoadResults(currentFilename)

  // INFO: get the "most recent" current results (last item of the list)
  const output = parseResults(latestResults[0], currentResults[currentResults.length - 1])

  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  const options = octokit.issues.listComments.endpoint.merge({
    owner: OWNER,
    repo: REPO,
    issue_number: PR_ID
  })
  try {
    const comments = await octokit.paginate(options)
    // TODO: should probably move `npm-deploy-user` into an environment variable
    const updateComment = comments.find((c) => c.user.login === 'npm-deploy-user')

    if (updateComment) {
      log.verbose('Updating comment...')
      await octokit.issues.updateComment({
        owner: OWNER,
        repo: REPO,
        comment_id: updateComment.id,
        body: output
      })
    } else {
      log.verbose('Posting comment...')
      await octokit.issues.createComment({
        owner: OWNER,
        repo: REPO,
        issue_number: PR_ID,
        body: output
      })
    }
  } catch (err) {
    log.error(err.message)
    log.error(err.status)
    throw err
  }
}
