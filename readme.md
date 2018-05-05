# node-compat

> Easily allow your Node program to run in a target node version range to maximize compatibility.

[![Build Status](https://travis-ci.org/transitive-bullshit/node-compat.svg?branch=master)](https://travis-ci.org/transitive-bullshit/node-compat) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

- **Super simple** to use.
- If node doesn't satisfy a target semver range, installs the right version with **npx** and continues.
- **Targeted at CLIs** that want to **maximize compatibility** without sacrificing JS features.
- Use **async / await** in older versions of node!
- **No complicated transpilation**.
- **No monkey-patching**.
- Single dependency with **~50 lines of code**.
- Optionally pin your node program to a **specific version** of node for extreme reproducibility.
- Built with the secure and popular **[npx](https://github.com/zkat/npx)**.

**NOTE**: This module is not yet available on NPM, as I'm awaiting the results of a module dispute for the name `node-compat.


## Why

A lot of Node.js CLI programs need to support older versions of Node, and in order to do so, they either:

- Resort to using deprecated ES5 syntax and carefully make sure all dependencies follow suit.
- Require the CLI to be run via Docker which is clumsy to execute (eg. no `npm install -g`).
- Rely on a complicated transpilation step in order to achieve backwards compatibility.

While transpilation is great for larger projects, it's a bit of a headache, when all you really want to do is ensure your program works for end users.

> `node-compat` is the simplest way of ensuring a compatible node version without sacrificing the latest & greatest Node features.


## How it works

You require `node-compat` and pass a desired node semver [range](https://www.npmjs.com/package/semver#ranges) (like `'>= 8'` or `'^6.0.0'`).

If the current process's node version satisfies that range, then `node-compat` returns without doing anything.

If the current process does not satisfy that range, then `npx` is used to temporarily install the appropriate matching version of [node](https://www.npmjs.com/package/node) from npm and re-run the current process as a subprocess using the temporary node executable. In this case, all commandline flags, environment variables, and stdio will be inherited from the current process. The child process will again run into `node-compat`, only this time it will continue executing your code normally because the version check is satisfied. Once the child process terminates, either due to successful completion or an error, `node-compat` will exit the parent process with the same exit code.

**Note**: it is recommended but not required for you to invoke `node-compat` at the very beginning of your program.
**Note**: `node-compat` requires an active internet connection for `npx` to install the correct version of node.


## Install

This module requires `node >= 4`.

```bash
npm install --save node-compat
```

## Usage

```js
const compat = require('node-compat')

compat({ node: '>= 8' })

// regular JS code using modern features here...
```


## API

### compat(opts)

Ensure the current Node process satisfies the given requirements.

#### opts

Type: `Object`
**Required**

#### opts.node

Type: `String`
**Required**

Required semver [range](https://www.npmjs.com/package/semver#ranges) for the node `process.version`.

Examples:

```js
compat({ node: '>= 8' })
compat({ node: '^6' })
compat({ node: '9' })
compat({ node: '7.10.0' })
compat({ node: '4 || >=9 || 6.0.0 - 7.0.0' })
```


## Related

- [npx](https://github.com/zkat/npx) - Used under the hood to execute specific versions of node from npm.
- [node](https://www.npmjs.com/package/node) - NPM package bundling different versions of node for different platforms.
- [node language features](https://node.green/) - Breakdown of supported features across different versions of node.


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
