// we'll rewrite this to a relative require
const something = require('something');
const other = require('./else');

module.exports = {
  something,
  else: other,
};
