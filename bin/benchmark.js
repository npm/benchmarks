#!/usr/bin/env node

const fs = require('fs')
const { spawnSync } = require('child_process')
const { join, basename } = require('path')
const npa = require('npm-package-arg')
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')
const { hasPkg } = require('../lib/manager.js')
const DIR = require('../lib/dirs.js')
const parseResult = require('../lib/parse-result.js')
const generateReport = require('../lib/report.js')
const generateGraphs = require('../lib/graph.js')
const { managersSet, managers, benchmarks, fixtures } = require('../lib/options.js')

const rimraf = (dir) => fs.rmSync(dir, { recursive: true, force: true })

const mkdirp = (dir) => fs.mkdirSync(dir, { recursive: true })

const spawn = (bin, args, opts) => spawnSync(bin, args, { stdio: 'inherit', ...opts })

const main = () => {
  const { argv } = yargs(hideBin(process.argv))
    .option('m', {
      alias: 'managers',
      describe: 'the package managers to benchmark (must be npm installable strings)',
      default: ['all'],
      type: 'array',
      coerce: (v) => v.includes('all') ? managers.map(m => `${m}@latest`) : v,
    })
    .option('b', {
      alias: 'benchmarks',
      describe: 'the benchmarks to run',
      default: ['all'],
      choices: benchmarks,
      type: 'array',
      coerce: (v) => v.includes('all') ? benchmarks : v,
    })
    .option('f', {
      alias: 'fixtures',
      describe: 'which fixtures to run the given benchmarks against',
      default: ['all'],
      choices: fixtures,
      type: 'array',
      coerce: (v) => v.includes('all') ? fixtures : v,
    })
    .option('r', {
      alias: 'report',
      default: false,
      describe: 'generate a text report',
      type: 'boolean',
    })
    .option('g', {
      alias: 'graph',
      default: false,
      describe: 'generate an svg graph',
      type: 'boolean',
    })
    .option('show-output', {
      default: false,
      type: 'boolean',
    })
    .option('clean-managers', {
      default: true,
      type: 'boolean',
    })
    .option('download-only', {
      default: false,
      type: 'boolean',
    })
    .option('warmup', {
      default: 1,
      type: 'number',
    })
    .option('runs', {
      default: 2,
      type: 'number',
    })
    .check((a) => {
      if (a.report && a.managers.length !== 2) {
        throw new Error('report mode requires exactly 2 managers')
      }
      return true
    })
    .help()

  console.log('cleaning up old state')
  rimraf(DIR.temp)
  rimraf(DIR.results)
  if (argv.cleanManagers) {
    rimraf(DIR.managers)
  }
  mkdirp(DIR.results)
  mkdirp(DIR.managers)

  const parsedManagers = argv.managers.map((arg) => {
    const spec = npa(arg)

    let alias
    let version
    // ignoring since tets only use registry package managers
    // but this supports git specs for PRs and file specs
    /* istanbul ignore next */
    if (spec.registry) {
      alias = `npm:${spec.name}@${spec.fetchSpec}`
      version = spec.fetchSpec
    } else if (spec.type === 'git') {
      alias = spec.saveSpec
      version = spec.gitCommittish
    } else if (spec.type === 'file') {
      alias = basename(spec.fetchSpec)
      version = basename(spec.fetchSpec)
    }

    return {
      name: arg,
      spec,
      alias,
      slug: `${spec.name}_${version.replace(/\.+/g, '-').replace(/\/+/g, '_')}`,
      supported: managersSet.has(spec.name),
    }
  })

  console.log('pre-installing package managers...')
  for (const manager of parsedManagers) {
    if (!manager.supported) {
      throw new Error(`Unsupported manager: \`${manager.name}\``)
    }

    if (hasPkg(manager.slug)) {
      console.log(`skipping ${manager.spec}, already installed as ${manager.alias}`)
      continue
    }

    console.log(`installing ${manager.spec} as ${manager.slug} using ${manager.alias}`)
    const result = spawn('npm', [
      'install',
      '--no-fund',
      '--no-audit',
      '--no-progress',
      '--silent',
      '--no-progress',
      '--global-style',
      '--prefix=./managers',
      '--logs-dir=./managers/logs',
      '--cache=./managers/cache',
      // force is necessary to overwrite bin files and allow all installations to complete
      '--force',
      `${manager.slug}@${manager.alias}`,
    ])

    if (result.status !== 0) {
      throw new Error(`failed to install ${manager.slug}@${manager.alias}`)
    }
  }

  if (argv.downloadOnly) {
    console.log('Download only, exiting after downloading managers')
    return
  }

  const hyperfine = spawn('hyperfine', [
    '--ignore-failure',
    '--export-json', join(DIR.results, 'results.json'),
    '--warmup', argv.warmup,
    '--runs', argv.runs,
    '--parameter-list', 'benchmark', argv.benchmarks.join(','),
    '--parameter-list', 'fixture', argv.fixtures.join(','),
    '--parameter-list', 'manager', parsedManagers.map(m => m.slug).join(','),
    '--prepare', `${join(DIR.bin, 'prepare.js')} {manager} {benchmark} {fixture}`,
    `${join(DIR.bin, 'execute.js')} {manager} {benchmark} {fixture}`,
  ])

  /* istanbul ignore next */
  if (hyperfine.status !== 0 || hyperfine.error) {
    const err = hyperfine.error ?? new Error(`hyperfine error: ${hyperfine.output.join('\n')}`)
    throw Object.assign(err, { code: hyperfine.status || 1 })
  }

  const result = parseResult()

  if (argv.report) {
    const report = generateReport(result, ...parsedManagers)
    fs.writeFileSync(join(DIR.results, 'report.md'), report)
  }

  if (argv.graph) {
    const graphs = generateGraphs(result)
    for (const name in graphs) {
      fs.writeFileSync(join(DIR.results, `${name}.svg`), graphs[name])
    }
  }

  console.log('Generated files:', fs.readdirSync(DIR.results))
}

try {
  const START_TIME = Date.now()
  main()
  console.log(`finished in %dms`, Date.now() - START_TIME)
} catch (err) {
  console.error(err)
  process.exitCode = err.code || 1
}
