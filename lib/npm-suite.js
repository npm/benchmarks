'use strict'

const { join } = require('path')

const {
  CACHE_NAME,
  FIXTURES_DIR
} = require('./constants')

const {
  createEnv,
  removeCache,
  removeNodeModules,
  removeLockfile,
  measureAction
} = require('./suite-actions')

/**
 * NOTE: Scenario Ordering
 * The first scenario needs to be an "initial install" to populate the cache,
 * node_modules folder, and create a lockfile. All the subsequent scenarios
 * can be in any order. As a subsequent scenario starts with populated cache,
 * node_modules folder, and lockfile (created from the previous scenario),
 * they mearly need to remove the idea they do not want.
 */
module.exports.suiteName = 'npm'
module.exports.suiteCmd = 'npm'
module.exports.scenarios = [
  {
    name: 'Initial install',
    details: {
      cache: false,
      node_modules: false,
      lockfile: false
    },
    cmd: 'npm',
    args: [
      'install',
      '--ignore-scripts',
      '--cache',
      `${CACHE_NAME}`,
      '--registry',
      'https://registry.npmjs.org/'
    ],
    actions: [
      removeCache,
      removeNodeModules,
      removeLockfile,
      async (ctx, fixture) => {
        const { cmd, args } = ctx
        const env = createEnv()

        const cwd = join(FIXTURES_DIR, fixture)
        return measureAction({ cmd, args, env, cwd })
      }
    ]
  },
  {
    name: 'Repeat install',
    details: {
      cache: true,
      node_modules: true,
      lockfile: true
    },
    cmd: 'npm',
    args: [
      'install',
      '--ignore-scripts',
      '--cache',
      `${CACHE_NAME}`,
      '--registry',
      'https://registry.npmjs.org/'
    ],
    actions: [
      (ctx, fixture) => {
        const { cmd, args } = ctx
        const env = createEnv()

        const cwd = join(FIXTURES_DIR, fixture)
        return measureAction({ cmd, args, env, cwd })
      }
    ]
  },
  {
    name: 'With warm cache',
    details: {
      cache: true,
      node_modules: false,
      lockfile: false
    },
    cmd: 'npm',
    args: [
      'install',
      '--ignore-scripts',
      '--cache',
      `${CACHE_NAME}`,
      '--registry',
      'https://registry.npmjs.org/'
    ],
    actions: [
      removeNodeModules,
      removeLockfile,
      (ctx, fixture) => {
        const { cmd, args } = ctx
        const env = createEnv()

        const cwd = join(FIXTURES_DIR, fixture)
        return measureAction({ cmd, args, env, cwd })
      }
    ]
  },
  {
    name: 'With node_modules',
    details: {
      cache: false,
      node_modules: true,
      lockfile: false
    },
    cmd: 'npm',
    args: [
      'install',
      '--ignore-scripts',
      '--cache',
      `${CACHE_NAME}`,
      '--registry',
      'https://registry.npmjs.org/'
    ],
    actions: [
      removeCache,
      removeLockfile,
      (ctx, fixture) => {
        const { cmd, args } = ctx
        const env = createEnv()

        const cwd = join(FIXTURES_DIR, fixture)
        return measureAction({ cmd, args, env, cwd })
      }
    ]
  },
  {
    name: 'With lockfile',
    details: {
      cache: false,
      node_modules: false,
      lockfile: true
    },
    cmd: 'npm',
    args: [
      'install',
      '--ignore-scripts',
      '--cache',
      `${CACHE_NAME}`,
      '--registry',
      'https://registry.npmjs.org/'
    ],
    actions: [
      removeCache,
      removeNodeModules,
      (ctx, fixture) => {
        const { cmd, args } = ctx
        const env = createEnv()

        const cwd = join(FIXTURES_DIR, fixture)
        return measureAction({ cmd, args, env, cwd })
      }
    ]
  },
  {
    name: 'With warm cache and node_modules',
    details: {
      cache: true,
      node_modules: true,
      lockfile: false
    },
    cmd: 'npm',
    args: [
      'install',
      '--ignore-scripts',
      '--cache',
      `${CACHE_NAME}`,
      '--registry',
      'https://registry.npmjs.org/'
    ],
    actions: [
      removeLockfile,
      (ctx, fixture) => {
        const { cmd, args } = ctx
        const env = createEnv()

        const cwd = join(FIXTURES_DIR, fixture)
        return measureAction({ cmd, args, env, cwd })
      }
    ]
  },
  {
    name: 'With warm cache and lockfile',
    details: {
      cache: true,
      node_modules: false,
      lockfile: true
    },
    cmd: 'npm',
    args: [
      'install',
      '--ignore-scripts',
      '--cache',
      `${CACHE_NAME}`,
      '--registry',
      'https://registry.npmjs.org/'
    ],
    actions: [
      removeNodeModules,
      (ctx, fixture) => {
        const { cmd, args } = ctx
        const env = createEnv()

        const cwd = join(FIXTURES_DIR, fixture)
        return measureAction({ cmd, args, env, cwd })
      }
    ]
  },
  {
    name: 'With node_modules and lockfile',
    details: {
      cache: false,
      node_modules: true,
      lockfile: true
    },
    cmd: 'npm',
    args: [
      'install',
      '--ignore-scripts',
      '--cache',
      `${CACHE_NAME}`,
      '--registry',
      'https://registry.npmjs.org/'
    ],
    actions: [
      removeCache,
      (ctx, fixture) => {
        const { cmd, args } = ctx
        const env = createEnv()

        const cwd = join(FIXTURES_DIR, fixture)
        return measureAction({ cmd, args, env, cwd })
      }
    ]
  },
  {
    name: 'cleanup',
    details: {},
    cmd: 'noop',
    args: [],
    actions: [
      removeCache,
      removeNodeModules,
      removeLockfile,
      (ctx, fixture) => 0
    ]
  }
]
