const { BENCHMARKS, FLAGS, MANAGERS, UNSUPPORTED_ERROR } = require('../lib/options.js')

const managers = {
  [MANAGERS.NPM]: ({ manager: { version }, flag }) => {
    const args = ['install', '--ignore-scripts', '--cache=./cache']

    if (version.major < 6) {
      throw UNSUPPORTED_ERROR('npm <6')
    }

    if (version.major === 6) {
      switch (flag) {
        case FLAGS.AUDIT:
          break
        case FLAGS.PEER_DEPS:
          throw UNSUPPORTED_ERROR('npm@6 with peer deps')
        default:
          args.push('--no-audit')
      }
    } else {
      // assume any other version of npm is valid so we dont
      // need to update this when a new major is released.
      switch (flag) {
        case FLAGS.AUDIT:
          args.push('--legacy-peer-deps')
          break
        case FLAGS.PEER_DEPS:
          break
        default:
          args.push('--no-audit', '--legacy-peer-deps')
      }
    }

    return args
  },

  [MANAGERS.YARN]: ({ flag }) => {
    const args = ['--ignore-scripts', '--cache-folder', './cache']

    switch (flag) {
      case FLAGS.AUDIT:
        args.push('--audit')
        break
      case FLAGS.PEER_DEPS:
        throw UNSUPPORTED_ERROR('yarn with peer deps')
    }

    return args
  },

  [MANAGERS.PNPM]: ({ flag }) => {
    const args = ['install', '--ignore-scripts', '--store-dir', './cache']

    switch (flag) {
      case FLAGS.AUDIT:
        throw UNSUPPORTED_ERROR('pnpm with audit')
      case FLAGS.PEER_DEPS:
        throw UNSUPPORTED_ERROR('pnpm with peer deps')
    }

    return args
  },
}

const install = ({ remove, restore }) => ({
  args: (o) => managers[o.manager.name](o),
  prepare: (o) => {
    if (remove) {
      o.remove(remove)
    }
    if (restore) {
      o.restore(restore)
    }
  },
})

module.exports = {
  [BENCHMARKS.CLEAN]: install({
    remove: [
      'cache',
      'node_modules',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
  }),

  [BENCHMARKS.LOCK_ONLY]: install({
    remove: [
      'cache',
      'node_modules',
    ],
    restore: [
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
  }),

  [BENCHMARKS.CACHE_ONLY]: install({
    remove: [
      'node_modules',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
    restore: [
      'cache',
    ],
  }),

  [BENCHMARKS.MODULES_ONLY]: install({
    remove: [
      'cache',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
    restore: [
      'node_modules',
    ],
  }),

  [BENCHMARKS.NO_LOCK]: install({
    remove: [
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
    restore: [
      'cache',
      'node_modules',
    ],
  }),

  [BENCHMARKS.NO_CACHE]: install({
    remove: [
      'cache',
    ],
    restore: [
      'node_modules',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
  }),

  [BENCHMARKS.NO_MODULES]: install({
    remove: [
      'node_modules',
    ],
    restore: [
      'cache',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
  }),

  [BENCHMARKS.NO_CLEAN]: install({
    restore: [
      'cache',
      'node_modules',
      'package-lock.yaml',
      'yarn.lock',
      'pnpm-lock.yaml',
    ],
  }),

  [BENCHMARKS.RUN_SCRIPT]: {
    prepare: ({ spawn }) => {
      spawn('npm', ['pkg', 'set', 'scripts.echo=echo 1'])
    },
    args: () => ['run', 'echo'],
  },

  [BENCHMARKS.SHOW_VERSION]: {
    args: () => ['--version'],
  },
}
