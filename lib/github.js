const { Octokit } = require('@octokit/rest')

const { PR_ID, REPO, OWNER, GITHUB_TOKEN } = process.env

const postComment = async (comment) => {
  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  const comments = await octokit.paginate(octokit.issues.listComments, {
    owner: OWNER,
    repo: REPO,
    issue_number: PR_ID,
  })
  const updateComment = comments.find((c) => c.user.login === 'npm-robot')

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
