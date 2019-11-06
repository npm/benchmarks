'use strict'

const child = require('child_process')
const log = require('npmlog')
const fs = require('fs')
const { join } = require('path')

const { RESULTS_DIR } = require('./constants')

const { LOG_LEVEL } = process.env

log.level = LOG_LEVEL || 'info'
exports.log = log

exports.safeLoadResults = function safeLoadResults (filename) {
  const filepath = join(RESULTS_DIR, filename)
  try {
    const file = fs.readFileSync(filepath, 'utf8')
    return (file) ? JSON.parse(file) : []
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
    return []
  }
}

exports.writeResults = function writeResults (filename, results) {
  console.log('filename:', filename)
  const filepath = join(RESULTS_DIR, filename)
  console.log('filepath:', filepath)
  try {
    const data = JSON.stringify(results, null, '  ')
    fs.writeFileSync(filepath, data)
  } catch (err) {
    throw err
  }
}

exports.fetchCommandVersion = function fetchCommandVersion (cmd) {
  const result = child.spawnSync(cmd, ['--version'])
  if (result.status !== 0) {
    log.error(result.error)
    throw new Error(`${cmd} failed with status code ${result.status}`)
  }
  const version = result.stdout.toString().trim()
  return version
}
