const fs = require('fs');
const assert = require('assert');
const webpack = require('webpack');
const webpackVersion = require('webpack/package.json').version
const config = require('./webpack.config');

console.log(`Running a build for webpack@${webpackVersion}`);
const compiler = webpack(config);
fs.writeFileSync('./mapping', 'something:something');

/**
 * Throwing inside this callback doesn't cause the program to exit 1 in
 * webpack 4. To get around this I've wrapped the entire thing in a try/catch
 * to detect errors and set the exit code myself.
 */
compiler.run((err, stats) => {
  try {
    if (err) throw err;
    stats.compilation.errors.forEach((statsErr) => {
      throw statsErr;
    });

    const message = `We should see an object like { something: 'something', else: 'else' }`;
    const result = require('./dist/index.js');
    const resolvedLocation = require.resolve('./dist/index.js');
    delete require.cache[resolvedLocation];
    assert.equal(result.something, 'something', message);
    assert.equal(result.else, 'else', message);


    /**
     * Stretch goal: make the resolver invalidate cached
     * requests when the mapping file changes.
     */
    // fs.writeFileSync('./mapping', 'something:somethingelse');
    // compiler.run((err2, stats) => {
    //   const result2 = require('./dist/index.js');
    //   const message2 = `Found ${result2.something} instead of somethingelse`;
    //   assert.equal(result2.something, 'somethingelse', message2);
    // });
  } catch(e) {
    process.exitCode = 1; // exit 1
    throw e; // rethrow to log
  }
});
