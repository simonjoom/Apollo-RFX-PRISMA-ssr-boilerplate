#!/usr/bin/env node
console.log('Starting directory: ' + process.cwd());
try {
  process.chdir('./server');
  console.log('New directory: ' + process.cwd());

  node -r dotenv/config server/index.js
}
catch (err) {
  console.log('chdir: ' + err);
}