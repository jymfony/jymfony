const Autoloader = require('./src/Autoloader');

let autoloader = new Autoloader();
autoloader.register();

module.exports = autoloader;
