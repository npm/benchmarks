'use strict'

const comment = require('./lib/comment')
const execute = require('./lib/execute')
const { log } = require('./lib/utils')

const args = process.argv.slice(2)
const command = args.length && args[0]
const isRelease = args.length && args[1]

log.verbose('ARGS:', args)
const { PR_ID, REPO, OWNER } = process.env

switch (command) {
  case 'benchmark':
    log.info('Executing benchmark against latest release')
    execute(!!isRelease)
    break
  case 'comment':
    // TODO: bail out if we don't have correct environment variables
    log.info(`Posting Comment to ${OWNER}/${REPO}/pulls/${PR_ID}`)
    comment()
    break
  default:
    log.error('Invalid argument supplied...')
    log.error('Please use the npm-scripts.')
}
