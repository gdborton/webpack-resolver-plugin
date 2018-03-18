const fs = require('fs');
const childProcess = require('child_process');
const webpackVersions = [
  '3.11.0',
  '4.1.0',
];

function nodeModuleFolderNameForWebpackVersion(version) {
  return `node_modules_webpack_${version.replace(/\./g, '-')}`
}

function installWebpack(version) {
  if (fs.existsSync('node_modules')) {
    fs.unlinkSync('node_modules');
  }
  const installLocation = nodeModuleFolderNameForWebpackVersion(version);
  const installed = fs.existsSync(installLocation);
  if (!installed) {
    childProcess.execSync(`npm install webpack@${version}`);
    fs.renameSync('node_modules', installLocation);
  }

  fs.symlinkSync(installLocation, 'node_modules');
}

function runTests() {
  webpackVersions.forEach((version) => {
    installWebpack(version);
    const start = Date.now();
    try {
      const result = childProcess.execSync(`node build.js`, {
        stdio: 'inherit', // makes console.log work in child process :)
      });
      console.log(`\nwebpack@${version}: Success! (${Date.now() - start}ms)\n`);
    } catch (e) {
      console.warn(`\nwebpack@${version}: Failed! (${Date.now() - start}ms)\n`);
    }
  });
}

runTests();
