'use strict'

const child = require('child_process')
const rimraf = require('rimraf')
const { join } = require('path')
const { log } = require('./utils')

const { CACHE_NAME, FIXTURES_DIR } = require('./constants')

exports.measureAction = async function measureAction ({ cmd, args, env, cwd }) {
  log.verbose('measureAction', 'executing...')
  log.silly('measureAction', 'cmd: %s', cmd) // TESTING
  log.silly('measureAction', 'args: %o', args) // TESTING
  log.silly('measureAction', 'env: %o', env) // TESTING
  log.silly('measureAction', 'cwd: %s', cwd) // TESTING
  const startTime = Date.now()

  // TODO: allow config to be passed in to allow process output 'stdio'
  const result = child.spawnSync(cmd, args, { env, cwd })
  if (result.status !== 0) {
    log.error(result.error)
    throw new Error(`${cmd} failed with status code ${result.status}`)
  }
  const endTime = Date.now()
  return endTime - startTime
}

exports.createEnv = function createEnv (overrides = {}) {
  const env = Object.keys(process.env).reduce((acc, key) => {
    return (key.match(/^npm_/))
      // Don't include `npm_` key/values
      ? acc
      // Add key/value to env object
      : Object.assign({}, acc, { [key]: process.env[key] })
  }, {})
  log.silly('createEnv', 'env: %o', env)
  return Object.assign({}, env, overrides)
}

exports.removePath = async function removePath (path) {
  return new Promise((resolve, reject) => {
    rimraf(path, {}, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

exports.removeCache = async function removeCache (ctx, fixture) {
  log.verbose('removeCache', 'removing cache...')
  const cacheDir = join(FIXTURES_DIR, fixture, CACHE_NAME)
  log.silly('removeCache', 'cacheDir: %s', cacheDir)
  return exports.removePath(cacheDir)
}

exports.removeNodeModules = async function removeNodeModules (ctx, fixture) {
  log.verbose('removeNodeModules', 'removing node_modules...')
  const cwd = join(FIXTURES_DIR, fixture)
  const nodeModulesDir = join(cwd, 'node_modules')
  log.silly('removeNodeModules', 'nodeModulesDir: %s', nodeModulesDir)
  return exports.removePath(nodeModulesDir)
}

exports.removeLockfile = async function removeLockfile (ctx, fixture) {
  log.verbose('removeLockfile', 'removing lockfile...')
  // TODO: change this to use `scenario.lockfile`
  const cwd = join(FIXTURES_DIR, fixture)
  const lockfilePath = join(cwd, 'package-lock.json')
  log.silly('removeLockfile', 'lockfilePath: %s', lockfilePath)
  return exports.removePath(lockfilePath)
}
