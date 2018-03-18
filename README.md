# Webpack Resolver Plugin Rewrite!

This is a repo setup to help understand how someone might rewrite a resolver plugin from webpack v3 to the newer apis in webpack 4.

## Repo Setup

TLDR:
```
git clone git@github.com:gdborton/webpack-resolver-plugin.git;
cd webpack-resolver-plugin;
node runTests.js; # webpack 3 should pass, 4 should fail.
```

There is nothing to install manually. I wrote a `runTests.js` file that will install both webpack 3 and 4 in separate node_modules folders, and will symlink the relevant version when running the tests.

The tests in this case are successful webpack compiles (`node build.js` which is run by `runTests.js`) that contain no errors, and result in the correct build.

Specifically, we're successful if the resolver plugin `MySweetResolverPlugin` correctly rewrites the non-relative import in `src/index.js` for `something` to be either a relative import, or an import to the absolute path of `src/something.js`.

## Stretch Goals

**Make the plugin compatible with v3 and v4**
This should be relatively simple through feature detection. There are new apis in v4 that we should be able to branch on. This might be even easier if webpack added its version to the compiler, since the only way to get it otherwise is `require('webpack/package.json').version`, but this won't work for my needs.

**Make the plugin respect changes in a mapping file**
At Airbnb we're using a similar resolver plugin to read from different project definition files, which can tell us how to handle "magic" imports. This is working great in webpack 3, but we noticed that changing the contents of the project files doesn't prompt new resolver calls.

The file to resolve `something` is therefore controlled by the contents of the `./mapping` file in this repository. If at all possible, I'd like to make changes to this file rebuild our bundle, and change the resolved file (the `build.js` file contains a commented test for this).

**Note:** This is actually something that could be really useful for any resolver utilizing the DescriptionFilePlugin (package.json, bower.json, etc.), as far as I can tell webpack isn't watching these for changes either.
