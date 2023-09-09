const { join } = require('path')
const semver = require('semver')
const fs = require('fs')
const DIR = require('./dirs.js')

const getPath = (slug) => join(DIR.managers, 'node_modules', slug)

const hasPkg = (slug) => fs.existsSync(getPath(slug))

const getPkg = (slug) => {
  const pkgPath = getPath(slug)
  const pkg = JSON.parse(
    fs.readFileSync(join(pkgPath, 'package.json'), { encoding: 'utf-8' })
  )
  return {
    slug,
    name: pkg.name,
    bin: join(pkgPath, pkg.bin[pkg.name]),
    version: semver.parse(pkg.version),
  }
}

module.exports = {
  hasPkg,
  getPkg,
}
