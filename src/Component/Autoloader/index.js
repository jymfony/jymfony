const Autoloader = require('./src/Autoloader');

const autoloader = new Autoloader();
autoloader.register();

module.exports = autoloader;

require('./src/assert');
require('./src/Exception/ReflectionException');
require('./src/Reflection/ReflectionClass');
require('./src/Metadata/MetadataStorage');
