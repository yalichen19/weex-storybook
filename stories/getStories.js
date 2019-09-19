const path = require('path');
const fs = require('fs-extra');
const storiesConfig = require('./storyMenu')
storiesConfig.forEach(element => {
  const { id } = element;
  const source = fs.readFileSync(path.resolve(__dirname, `../src/components/${id}.vue`)).toString();
  element.source = source;
});

module.exports = storiesConfig;