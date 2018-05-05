'use strict'

// NOTE: we're purposefully using some deprecated syntax instead of more modern
// alternatives for strict compatibility with node >= 4.

const execa = require('execa')
const semver = require('semver')

const nodeVersions = require('./node-versions')

module.exports = function (opts) {
  opts.process = opts.process || process
  opts.stdio = opts.stdio || 'inherit'

  if (!opts.node) {
    throw new Error('missing required argument "opts.node"')
  }

  if (!semver.validRange(opts.node)) {
    throw new Error('invalid semver range "opts.node"')
  }

  if (semver.satisfies(opts.process.version, opts.node)) {
    return
  }

  const nodeVersion = semver.maxSatisfying(nodeVersions, opts.node)

  const args = [
    '-p',
    'node@' + nodeVersion,
    '--',
    'node'
  ].concat(opts.process.argv.slice(1))

  try {
    const child = execa.sync('npx', args, {
      stdio: opts.stdio
    })

    opts.process.exit(0)
    return child
  } catch (err) {
    opts.process.exit(err.code || 1)
    throw err
  }
}
