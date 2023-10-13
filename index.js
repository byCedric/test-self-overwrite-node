#!/usr/bin/env node

const spawnAsync = require('@expo/spawn-async');
const fs = require('fs');

async function run() {
  console.log('main', JSON.stringify(Object.keys(require.cache), null, 2));
  console.log('main', 'hello world');

  await fs.promises.writeFile(__filename, `
    // This is overwritten in the same process
    async function run() {
      console.log('overwrite', JSON.stringify(Object.keys(require.cache), null, 2));
      console.log('overwrite', 'hello world');
    }

    run()
      .then(() => console.log('overwrite', 'done'))
      .catch((err) => console.error('overwrite', err))
  `);

  await spawnAsync('node', [__filename], { stdio: 'inherit' });

  console.log('main', 'done!');
}

run();
