const { spawnSync } = require('child_process')
const { join } = require('path')
const fs = require('fs')
const { getPkg } = require('../lib/manager.js')
const DIR = require('../lib/dirs.js')

const remove = (root, paths) => {
  for (const path of paths) {
    const source = join(root, path)
    const target = join(root, `${path}.removed`)
    if (fs.existsSync(source)) {
      if (!fs.existsSync(target)) {
        fs.renameSync(source, target)
      } else {
        fs.rmSync(source, { recursive: true, force: true })
      }
    }
  }
}

const restore = (root, paths) => {
  for (const path of paths) {
    const source = join(root, `${path}.removed`)
    const target = join(root, path)
    if (fs.existsSync(source)) {
      fs.rmSync(target, { recursive: true, force: true })
      fs.renameSync(source, target)
    }
  }
}

const parseArgv = (args) => {
  const [manager, benchmarkParts, fixture] = args.slice(2)
  const [benchmark, flag = 'default'] = benchmarkParts.split(':')
  const cwd = join(DIR.temp, manager, fixture, flag)
  return {
    benchmark,
    flag,
    fixture,
    manager,
    cwd,
    fixturePath: join(DIR.fixtures, `${fixture}.json`),
  }
}

const prepare = (args) => {
  const argv = parseArgv(args)
  return {
    ...argv,
    remove: (p) => remove(argv.cwd, p),
    restore: (p) => restore(argv.cwd, p),
    spawn: (...a) => spawnSync(...a, { cwd: argv.cwd }),
  }
}

const execute = (args) => {
  const { manager: argvManager, ...argv } = parseArgv(args)
  const manager = getPkg(argvManager)
  return {
    ...argv,
    bin: manager.bin,
    manager,
  }
}

module.exports = {
  prepare,
  execute,
}
