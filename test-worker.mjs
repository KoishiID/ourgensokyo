const msg = `[${new Date().toISOString()}] Worker test OK`;
console.log(msg);
console.log('CWD:', process.cwd());
console.log('Node:', process.version);