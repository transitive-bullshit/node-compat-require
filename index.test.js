'use strict'

const { test } = require('ava')
const sinon = require('sinon')

const compatRequire = require('.')

console.log('running test suite with node', process.version)

test('node v10.0.0 requires >= 8 : normal require no-op', function (t) {
  const opts = {
    node: '>= 8',
    stdio: 'pipe',
    process: {
      argv: [ 'node', '--version' ],
      version: 'v10.0.0',
      exit: sinon.spy()
    }
  }

  const module = compatRequire('.', opts)

  t.truthy(module)
  t.deepEqual(module, require('.'))
  t.falsy(opts.process.exit.called)
})

test('node v8.8.0 requires >= 8 : normal require no-op', function (t) {
  const opts = {
    node: '>= 8',
    stdio: 'pipe',
    process: {
      argv: [ 'node', '--version' ],
      version: 'v10.0.0',
      exit: sinon.spy()
    }
  }

  const module = compatRequire('.', opts)

  t.truthy(module)
  t.deepEqual(module, require('.'))
  t.falsy(opts.process.exit.called)
})

test('node v4.0.0 requires >= 9.0.0 : node --version', function (t) {
  const opts = {
    node: '>= 9',
    stdio: 'pipe',
    process: {
      argv: [ 'node', '--version' ],
      version: '4.0.0',
      exit: sinon.spy()
    }
  }

  const child = compatRequire('.', opts)

  t.deepEqual(child, {
    stdout: 'v10.0.0',
    stderr: '',
    code: 0,
    failed: false,
    signal: null,
    cmd: 'npx -p node@10.0.0 -- node --version',
    timedOut: false
  })
  t.truthy(opts.process.exit.calledOnceWithExactly(0))
})

test('node v6.4.0 requires ^8.11.0 : node --version', function (t) {
  const opts = {
    node: '^8.11.0',
    stdio: 'pipe',
    process: {
      argv: [ 'node', '--version' ],
      version: 'v6.4.0',
      exit: sinon.spy()
    }
  }

  const child = compatRequire('.', opts)

  t.deepEqual(child, {
    stdout: 'v8.11.1',
    stderr: '',
    code: 0,
    failed: false,
    signal: null,
    cmd: 'npx -p node@8.11.1 -- node --version',
    timedOut: false
  })
  t.truthy(opts.process.exit.calledOnceWithExactly(0))
})

test('node v8.8.0 requires 9.6.x : node --version', function (t) {
  const opts = {
    node: '9.6.x',
    stdio: 'pipe',
    process: {
      argv: [ 'node', '--version' ],
      version: 'v8.8.0',
      exit: sinon.spy()
    }
  }

  const child = compatRequire('.', opts)

  t.deepEqual(child, {
    stdout: 'v9.6.1',
    stderr: '',
    code: 0,
    failed: false,
    signal: null,
    cmd: 'npx -p node@9.6.1 -- node --version',
    timedOut: false
  })
  t.truthy(opts.process.exit.calledOnceWithExactly(0))
})

test('node v11.0.0 requires 7.10.0 : node --version', function (t) {
  const opts = {
    node: '7.10.0',
    stdio: 'pipe',
    process: {
      argv: [ '/usr/local/bin/node', '--version' ],
      version: 'v11.0.0',
      exit: sinon.spy()
    }
  }

  const child = compatRequire('.', opts)

  t.deepEqual(child, {
    stdout: 'v7.10.0',
    stderr: '',
    code: 0,
    failed: false,
    signal: null,
    cmd: 'npx -p node@7.10.0 -- node --version',
    timedOut: false
  })
  t.truthy(opts.process.exit.calledOnceWithExactly(0))
})

test('node v6.0.0 requires >= 8 : node -e "invalid" => should throw error', function (t) {
  const opts = {
    node: '>= 8',
    stdio: 'pipe',
    process: {
      argv: [ 'node', '-e "invalid"' ],
      version: 'v6.0.0',
      exit: sinon.spy()
    }
  }

  try {
    compatRequire('.', opts)
    t.fail('expected error to be thrown')
  } catch (err) {
    t.is(err.code, 9)
    t.is(err.stdout, '')
    t.is(err.stderr, 'node: bad option: -e "invalid"\n')
    t.is(err.failed, true)
    t.truthy(opts.process.exit.calledOnceWithExactly(9))
  }
})
