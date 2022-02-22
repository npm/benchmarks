const npa = require('npm-package-arg')
const { basename, resolve } = require('path')
const {
  existsSync: exists,
  readFileSync: readFile,
  renameSync: rename,
} = require('fs')
const { sync: rimraf } = require('rimraf')

const alias = (spec) => {
  if (typeof spec !== 'object')
    spec = npa(spec)

  let alias
  if (spec.registry) {
    alias = `npm:${spec.name}@${spec.fetchSpec}`
  } else if (spec.type === 'git') {
    alias = spec.saveSpec
  } else if (spec.type === 'file') {
    alias = basename(spec.fetchSpec)
  }
  return alias
}

const slug = (spec) => {
  if (typeof spec !== 'object')
    spec = npa(spec)

  let version
  if (spec.registry) {
    version = spec.fetchSpec.replace(/\./g, '-')
  } else if (spec.type === 'git') {
    version = spec.gitCommittish.replace(/\//g, '_')
  } else if (spec.type === 'file') {
    version = basename(spec.fetchSpec).replace(/\./g, '-')
  }
  return `${spec.name}_${version}`
}

const getPkg = (slug) => {
  const path = resolve(__dirname, '../managers/lib/node_modules', slug)
  return JSON.parse(readFile(resolve(path, 'package.json'), { encoding: 'utf8' }))
}

const getBin = (slug) => {
  const path = resolve(__dirname, '../managers/lib/node_modules', slug)
  const pkg = getPkg(slug)
  return resolve(path, pkg.bin[pkg.name])
}

const remove = (root, paths) => {
  for (const path of paths) {
    const source = resolve(root, path)
    const target = resolve(root, `${path}.removed`)
    if (exists(source)) {
      if (!exists(target))
        rename(source, target)
      else
        rimraf(source)
    }
  }
}

const restore = (root, paths) => {
  for (const path of paths) {
    const source = resolve(root, `${path}.removed`)
    const target = resolve(root, path)
    if (exists(source)) {
      rimraf(target)
      rename(source, target)
    }
  }
}

module.exports = {
  alias,
  getBin,
  getPkg,
  remove,
  restore,
  slug,
}
