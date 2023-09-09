const { spawnSync } = require('child_process')
const { join } = require('path')
const fs = require('fs')
const options = require('./options')
const { getPkg } = require('./manager.js')
const DIR = require('./dirs.js')

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

  if (!manager || !benchmarkParts || !fixture) {
    throw new Error('manager, benchmark, and fixture are requried')
  }

  const [benchmark, flag = 'default'] = benchmarkParts.split(':')

  let parsedManager
  try {
    parsedManager = getPkg(manager)
  } catch (err) {
    throw new Error(`Could not find installed package manager: ${manager} ${err}`)
  }

  return {
    benchmark,
    flag,
    fixture,
    manager: parsedManager,
  }
}

module.exports = (args) => {
  const argv = parseArgv(args)

  options.validateManager(argv.manager.name)
  options.validateBenchmark(argv.benchmark)
  options.validateFlag(argv.flag)
  options.validateFixture(argv.fixture)

  const cwd = join(DIR.temp, argv.manager.slug, argv.fixture, argv.flag)

  return {
    ...argv,
    cwd,
    bin: argv.manager.bin,
    fixturePath: join(DIR.fixtures, `${argv.fixture}.json`),
    remove: (p) => remove(cwd, p),
    restore: (p) => restore(cwd, p),
    spawn: (...a) => spawnSync(...a, { cwd }),
  }
}
