'use strict'

// NOTE: we're purposefully using some deprecated syntax instead of more modern
// alternatives for strict compatibility with node >= 4.

const dirname = require('path').dirname
const execa = require('execa')
const resolve = require('resolve')
const semver = require('semver')

const nodeVersions = require('./node-versions')

module.exports = function (path, opts) {
  if (!path) {
    throw new Error('missing required argument "path"')
  }

  if (!opts) {
    throw new Error('missing required argument "opts"')
  }

  if (!opts.node) {
    throw new Error('missing required argument "opts.node"')
  }

  if (!semver.validRange(opts.node)) {
    throw new Error('invalid semver range "opts.node"')
  }

  opts.process = opts.process || process
  opts.stdio = opts.stdio || 'inherit'
  opts.quiet = !!opts.quiet

  if (semver.satisfies(opts.process.version, opts.node)) {
    const id = resolve.sync(path, {
      basedir: dirname(module.parent.filename)
    })

    return require(id)
  }

  if (!opts.quiet) {
    console.warn(`this program requires a more recent version of \`node ${opts.node}\``)
  }

  const nodeVersion = semver.maxSatisfying(nodeVersions, opts.node)

  const args = [
    opts.quiet && '-q',
    '-p',
    'node@' + nodeVersion,
    '--',
    'node'
  ]
    .concat(opts.process.argv.slice(1))
    .filter(Boolean)

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
