const fs = require('fs');
const path = require('path');
const mappingLocation = path.resolve('mapping');

class MySweetResolverPlugin {
  apply(resolver) {
    resolver.plugin('resolve', function MyResolver(request, callback) {
      if (request.request === 'something') {
        const mappingContent = fs.readFileSync(mappingLocation, 'utf8');
        const result = path.resolve(`./src/${mappingContent.split(':')[1].trim()}.js`);
        const relativeResult = `./${path.relative(path.dirname(request.context.issuer), result)}`;

        const nextRequest = Object.assign({}, request, {
          request: relativeResult,
        });

        const message = "I'd buy that for a dollar!";
        resolver.doResolve('resolve', nextRequest, message, callback);
      } else {
        callback();
      }
    });
  }
}

module.exports = MySweetResolverPlugin;
