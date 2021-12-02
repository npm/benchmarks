#!/usr/bin/env node

const { spawnSync: spawn } = require('child_process')
const { readdirSync: readdir, mkdirSync: mkdir, writeFileSync: writeFile } = require('fs')
const { basename, resolve } = require('path')
const { sync: rimraf } = require('rimraf')
const npa = require('npm-package-arg')
const utils = require('./lib/utils.js')
const parseResult = require('./lib/parse-result.js')
const generateReport = require('./lib/report.js')
const generateGraphs = require('./lib/graph.js')
const { postComment } = require('./lib/github.js')

const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')

const startTime = Date.now()
process.on('exit', () => {
  console.log(`finished in %dms`, Date.now() - startTime)
})

const defaultManagers = [
  'npm@6',
  'npm@7',
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

const defaultFixtures = readdir('./fixtures')
  .filter((file) => file.endsWith('.json'))
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
    choices: ['all', ...defaultFixtures],
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
  .help()

if (argv.managers.includes('all'))
  argv.managers = defaultManagers

if (argv.benchmarks.includes('all'))
  argv.benchmarks = defaultBenchmarks

if (argv.fixtures.includes('all'))
  argv.fixtures = defaultFixtures

if (argv.report && argv.managers.length !== 2) {
  console.error('report mode requires exactly 2 managers')
  process.exit(1)
}

console.log('pre-installing package managers...')
rimraf(resolve(__dirname, './managers'))
rimraf(resolve(__dirname, './temp'))
mkdir(resolve(__dirname, './managers/lib'), { recursive: true })
mkdir(resolve(__dirname, './results/temp'), { recursive: true })

for (const manager of argv.managers) {
  const spec = npa(manager)
  const slug = utils.slug(manager)
  const alias = utils.alias(spec)
  console.log(`installing ${spec} as ${slug}...`)
  const result = spawn('npm', [
    'install',
    '--no-fund',
    '--no-audit',
    '--no-progress',
    '--loglevel=silent',
    '--global',
    '--force', // force is necessary to overwrite bin files and allow all installations to complete
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
  ...(argv.report || argv.graph ? ['--export-json', `${resolve(__dirname, 'results/temp/results.json')}`] : []),
  '--warmup', '1',
  '--runs', '2',
  '--parameter-list', 'benchmark', argv.benchmarks.join(','),
  '--parameter-list', 'fixture', argv.fixtures.join(','),
  '--parameter-list', 'manager', slugs.join(','),
  '--prepare', `${resolve(__dirname, 'prepare.js')} -m {manager} -b {benchmark} -f {fixture}`,
  `${resolve(__dirname, 'execute.js')} -m {manager} -b {benchmark} -f {fixture}`,
], { stdio: 'inherit' })

if (hyperfine.status !== 0) {
  console.error('benchmark failed!')
  process.exit(hyperfine.status)
}

const { PR_ID, REPO, OWNER, GITHUB_TOKEN: NPM_DEPLOY_USER_PAT } = process.env
const result = parseResult()

if (argv.report) {
  const report = generateReport(result,
    { slug: slugs[0], name: argv.managers[0] },
    { slug: slugs[1], name: argv.managers[1] })

  writeFile(resolve(__dirname, 'results/temp/report.md'), report)
  console.log('wrote results/temp/report.md')
  if (PR_ID && REPO && OWNER && GITHUB_TOKEN)
    postComment(report)
}

if (argv.graph) {
  const graphs = generateGraphs(result)
  for (const name in graphs) {
    writeFile(resolve(__dirname, `results/temp/${name}.svg`), graphs[name])
    console.log(`wrote results/temp/${name}.svg`)
  }
}
