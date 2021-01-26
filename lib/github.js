const { Octokit } = require('@octokit/rest')

const postComment = async (comment) => {
  const octokit = new Octokit({ auth: GITHUB_TOKEN })
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
      body: comment
    })
  } else {
    await octokit.issues.createComment({
      owner: OWNER,
      repo: REPO,
      issue_number: PR_ID,
      body: comment
    })
  }
}

module.exports = {
  postComment
}
