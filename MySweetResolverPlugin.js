const fs = require('fs');
const path = require('path');
const mappingLocation = path.resolve('mapping');

class MySweetResolverPlugin {
  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      const dependencyMap = new Map();

      compilation.resolvers.normal.plugin('described-resolve', function resolverPlugin(request, callback) {
        if (request.request === 'something') {
          const error = null;
          const mappingContent = fs.readFileSync(mappingLocation, 'utf8');
          const result = path.resolve('./src', `${mappingContent.split(':')[1].trim()}.js`);
          const nextRequest = Object.assign({}, request, {
            request: result,
          });
          dependencyMap.set(request.context.issuer, mappingLocation);
          const message = "I'd buy that for a dollar!";
          this.doResolve('resolve', nextRequest, message, callback);
        } else {
          callback();
        }
      });

      /**
       * This was written to attempt to invalidate resolver results when the
       * mapping file changes, by adding the mapping file as a file
       * dependency. What this resulted in was webpack rerunning loaders
       * against the file, but not rerunning the resolver logic for its
       * children. The stretch goal is to hook this up. Maybe not possible in
       * webpack 3... but 4?
       */
      compilation.plugin('record-modules', (modules) => {
        modules.forEach((mod) => {
          if (dependencyMap.has(mod.request)) {
            mod.fileDependencies.push(mappingLocation);
          }
        });
      });
    });
  }
}

module.exports = MySweetResolverPlugin;
