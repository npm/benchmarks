'use strict'

const { join } = require('path')

exports.BASE_DIR = join(__dirname, '..')
exports.FIXTURES_DIR = join(this.BASE_DIR, 'fixtures')
exports.TMP_DIR = join(this.BASE_DIR, 'tmp')
exports.RESULTS_DIR = join(this.BASE_DIR, 'results')

exports.CACHE_NAME = 'cache'
