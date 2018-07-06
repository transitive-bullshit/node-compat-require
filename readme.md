# node-compat-require

> Easily allow your Node program to run in a target node version range to maximize compatibility.

[![NPM](https://img.shields.io/npm/v/node-compat-require.svg)](https://www.npmjs.com/package/node-compat-require) [![Build Status](https://travis-ci.org/transitive-bullshit/node-compat-require.svg?branch=master)](https://travis-ci.org/transitive-bullshit/node-compat-require) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

- If unsupported node version, installs the right version with **npx** and continues.
- **Targeted at CLIs** that want to maximize compatibility without sacrificing JS features.
- Use **async / await** in older versions of node.
- Optionally pin your node program to a **specific version** of node for extreme reproducibility.

<p align="center">
  <img width="800" alt="Demo" src="https://cdn.rawgit.com/transitive-bullshit/node-compat-require/master/example/demo2.svg">
</p>


## Why

A lot of Node.js CLI programs need to support older versions of Node, and in order to do so, they either:

- Resort to using deprecated ES5 syntax and carefully make sure all dependencies follow suit.
- Require the CLI to be run via Docker which is clumsy to execute (eg. no `npm install -g`).
- Rely on a complicated transpilation step in order to achieve backwards compatibility.

While transpilation is great for larger projects, it's a bit of a headache, when all you really want to do is ensure your program works for end users.

> `node-compat-require` is the simplest way of ensuring a compatible node version without sacrificing the latest & greatest node features.


## Install

This module requires `node >= 4`.

```bash
npm install --save node-compat-require
```


## Usage

```js
const compatRequire = require('node-compat-require')

compatRequire('.', { node: '>= 8' })
```

In this example, './index.js' would be required only once the Node process is `>= 8`.

See the [example folder](https://github.com/transitive-bullshit/node-compat-require/tree/master/example) for a complete example of a node program which can be run with `node >= 4` but will enforce `node >= 8` at runtime in order to support newer JS features like async / await and object destructuring.


## API

### compatRequire(path, opts)

If the current node process satisfies the given requirements, returns `require(path)`.

If the current node process does not satisfy the requirements, installs the correct version of node, re-invokes the current node program as a subprocess, and exits once the child process exits.

#### path

Type: `String`
**Required**

Path of file to require if node process satisfies constraints. This may be a relative file just like a normal node `require` statement.

#### opts

Type: `Object`
**Required**

##### opts.node

Type: `String`
**Required**

Required semver [range](https://www.npmjs.com/package/semver#ranges) for the node `process.version`.

Examples:

```js
compat('.', { node: '>= 8' })
compat('./bin', { node: '^6' })
compat('./lib/cmd', { node: '9' })
compat('./example/cli', { node: '7.10.0' })
compat('.', { node: '4 || >=9 || 6.0.0 - 7.0.0' })
```

##### opts.quiet

Type: `Boolean`
Default: `false`

Use this to optionally silence the `npx` output.


## How it works

You require `node-compat-require` and pass a desired node semver [range](https://www.npmjs.com/package/semver#ranges) (like `'>= 8'` or `'^6.0.0'`).

If the current process's node version satisfies that range, then `node-compat-require` requires the target module and returns.

If the current process does not satisfy that range, then `npx` is used to temporarily install the appropriate matching version of [node](https://www.npmjs.com/package/node) from npm and re-run the current process as a subprocess using the temporary node executable. In this case, all commandline flags, environment variables, and stdio will be inherited from the current process. The child process will again run into `node-compat-require`, only this time it will require your target module normally because the version check is satisfied. Once the child process terminates, either due to successful completion or an error, `node-compat-require` will exit the parent process with the same exit code.

**Note**: it is recommended but not required for you to invoke `node-compat-require` at the very beginning of your program.
**Note**: `node-compat-require` needs an active internet connection for `npx` to install the correct version of node.


## Related

- [npx](https://github.com/zkat/npx) - Used under the hood to execute specific versions of node from npm.
- [node](https://www.npmjs.com/package/node) - NPM package bundling different versions of node for different platforms.
- [node language features](https://node.green/) - Breakdown of supported features across different versions of node.


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
