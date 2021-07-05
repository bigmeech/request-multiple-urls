const path = require('path');
const fs = require('fs');

module.exports = {
  requireBadJSON() {
    return fs.readFileSync(
      path.resolve(__dirname, './', 'bad_ftse-fsi.json'),
      'utf8'
    );
  },
};
