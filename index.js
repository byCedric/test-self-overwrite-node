#!/usr/bin/env node

const spawnAsync = require('@expo/spawn-async');
const fs = require('fs');
const path = require('path');
const { getText } = require('./helper');

async function run() {
  console.log('main', JSON.stringify(Object.keys(require.cache), null, 2));
  console.log('main', getText());

  // Overwrite the current `index.js`
  await fs.promises.writeFile(__filename, `
    // This is overwritten in the same process
    const { getText } = require('./helper');

    async function run() {
      console.log('overwrite', JSON.stringify(Object.keys(require.cache), null, 2));
      console.log('overwrite', getText());
    }

    run()
      .then(() => console.log('overwrite', 'done'))
      .catch((err) => console.error('overwrite', err))
  `);

  // Overwrite the current `index.js`
  await fs.promises.writeFile(path.resolve(__dirname, 'helper.js'), `
    // This is overwritten in the same process

    function getText() {
      return 'hello universe';
    }

    module.exports = { getText };
  `);

  await spawnAsync('node', [__filename], { stdio: 'inherit' });

  console.log('main', 'done!');
}

run();
