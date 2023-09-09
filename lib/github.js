const { Octokit } = require('@octokit/rest')

const { PR_ID, REPO, OWNER, GITHUB_TOKEN } = process.env

const hasEnv = () => PR_ID && REPO && OWNER && GITHUB_TOKEN

const postComment = async (comment) => {
  if (!hasEnv()) {
    console.log('no environment variables, skipping comment')
    return
  }

  console.log('PR_ID', PR_ID)
  console.log('REPO', REPO)
  console.log('OWNER', OWNER)
  console.log('GITHUB_TOKEN', GITHUB_TOKEN?.replace(/./g, '*'))

  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  const comments = await octokit.paginate(octokit.issues.listComments, {
    owner: OWNER,
    repo: REPO,
    issue_number: PR_ID,
  })
  const updateComment = comments.find((c) => c.user.login === 'npm-cli-bot')

  if (updateComment) {
    console.log('updating existing pull request comment...')
    await octokit.issues.updateComment({
      owner: OWNER,
      repo: REPO,
      comment_id: updateComment.id,
      body: comment,
    })
  } else {
    console.log('creating new pull request comment...')
    await octokit.issues.createComment({
      owner: OWNER,
      repo: REPO,
      issue_number: PR_ID,
      body: comment,
    })
  }
}

module.exports = {
  postComment,
}
