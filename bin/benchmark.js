#!/usr/bin/env node

const { spawnSync: spawn } = require('child_process')
const { readdirSync: readdir, mkdirSync: mkdir, writeFileSync: writeFile } = require('fs')
const { basename, resolve } = require('path')
const { sync: rimraf } = require('rimraf')
const npa = require('npm-package-arg')
const utils = require('../lib/utils.js')
const parseResult = require('../lib/parse-result.js')
const generateReport = require('../lib/report.js')
const generateGraphs = require('../lib/graph.js')
const { postComment } = require('../lib/github.js')

const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')

const startTime = Date.now()
process.on('exit', () => {
  console.log(`finished in %dms`, Date.now() - startTime)
})

const defaultManagers = [
  'npm@6',
  'npm@7',
  'npm@8',
  'yarn@latest',
  'pnpm@latest',
]

const defaultBenchmarks = [
  'clean',
  'lock-only',
  'cache-only',
  'cache-only:peer-deps',
  'modules-only',
  'no-lock',
  'no-cache',
  'no-modules',
  'no-clean',
  'no-clean:audit',
]

const root = resolve(__dirname, '..')
const defaultFixtures = readdir(resolve(__dirname, 'fixtures'))
  .filter((file) => file.endsWith('.json') && !file.startsWith('_'))
  .map((file) => basename(file, '.json'))

const { argv } = yargs(hideBin(process.argv))
  .option('m', {
    alias: 'managers',
    default: defaultManagers,
    describe: 'the package managers to benchmark (must be npm installable strings)',
    type: 'array',
  })
  .option('b', {
    alias: 'benchmarks',
    default: defaultBenchmarks,
    choices: ['all', ...defaultBenchmarks],
    describe: 'the benchmarks to run',
    type: 'array',
  })
  .option('f', {
    alias: 'fixtures',
    default: defaultFixtures,
    choices: ['all', ...defaultFixtures, '_test'],
    describe: 'which fixtures to run the given benchmarks against',
    type: 'array',
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
  .option('loglevel', {
    default: 'silent',
    type: 'string',
  })
  .help()

if (argv.managers.includes('all')) {
  argv.managers = defaultManagers
}

if (argv.benchmarks.includes('all')) {
  argv.benchmarks = defaultBenchmarks
}

if (argv.fixtures.includes('all')) {
  argv.fixtures = defaultFixtures
}

if (argv.report && argv.managers.length !== 2) {
  console.error('report mode requires exactly 2 managers')
  process.exit(1)
}

console.log('cleaning up old state', root)
rimraf(resolve(root, 'managers'))
rimraf(resolve(root, 'temp'))
rimraf(resolve(root, 'cache'))
rimraf(resolve(root, 'logs'))
mkdir(resolve(root, 'managers/lib'), { recursive: true })
mkdir(resolve(root, 'results/temp'), { recursive: true })

console.log('pre-installing package managers...')
for (const manager of argv.managers) {
  const spec = npa(manager)
  const slug = utils.slug(manager)
  const alias = utils.alias(spec)
  console.log(`installing ${spec} as ${slug} using ${alias}`)
  const result = spawn('npm', [
    'install',
    '--no-fund',
    '--no-audit',
    '--no-progress',
    `--loglevel=${argv.loglevel}`,
    '--global-style',
    '--force', // force is necessary to overwrite bin files and allow all installations to complete
    '--logs-dir=./logs',
    '--cache=./cache',
    '--prefix=./managers',
    `${slug}@${alias}`,
  ], { stdio: 'inherit' })

  if (result.status !== 0) {
    console.error(`failed to install ${slug}@${alias}`)
    process.exit(1)
  }
}

const slugs = argv.managers.map(utils.slug)

const hyperfine = spawn('hyperfine', [
  '--ignore-failure',
  ...(argv.loglevel !== 'silent' ? ['--show-output'] : []),
  ...(argv.report || argv.graph
    ? ['--export-json', `${resolve(root, 'results/temp/results.json')}`] : []),
  '--warmup', '1',
  '--runs', '2',
  '--parameter-list', 'benchmark', argv.benchmarks.join(','),
  '--parameter-list', 'fixture', argv.fixtures.join(','),
  '--parameter-list', 'manager', slugs.join(','),
  '--prepare', `${resolve(__dirname, 'prepare.js')} -m {manager} -b {benchmark} -f {fixture}`,
  `${resolve(__dirname, 'execute.js')} -m {manager} -b {benchmark} -f {fixture}`,
], { stdio: 'inherit' })

if (hyperfine.status !== 0 || hyperfine.error) {
  console.error('benchmark failed!')
  console.error('hyperfine error', hyperfine.error)
  process.exit(hyperfine.status || 1)
}

const { PR_ID, REPO, OWNER, GITHUB_TOKEN } = process.env
const result = parseResult()

if (argv.report) {
  const report = generateReport(result,
    { slug: slugs[0], name: argv.managers[0] },
    { slug: slugs[1], name: argv.managers[1] })

  writeFile(resolve(root, 'results/temp/report.md'), report)
  console.log('wrote results/temp/report.md')
  console.error({
    PR_ID,
    REPO,
    OWNER,
    GITHUB_TOKEN: GITHUB_TOKEN && GITHUB_TOKEN.replace(/./g, '*'),
  })
  if (PR_ID && REPO && OWNER && GITHUB_TOKEN) {
    postComment(report)
  }
}

if (argv.graph) {
  const graphs = generateGraphs(result)
  for (const name in graphs) {
    writeFile(resolve(root, `results/temp/${name}.svg`), graphs[name])
    console.log(`wrote results/temp/${name}.svg`)
  }
}
