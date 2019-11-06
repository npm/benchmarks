'use strict'

const execute = require('./lib/execute')
const { log } = require('./lib/utils')

// INFO: can potentially pass in command line arguments
const args = process.argv.slice(2)
const latest = (args.length && args[0] === 'latest')

log.verbose('ARGS:', args)
if (latest) {
  log.info('Executing benchmark against latest release')
} else {
  log.info('Executing benchmark against a version')
}
execute(latest)
