if (undefined === Symbol.metadata) {
    Symbol.metadata = Symbol.for('Symbol.metadata');
}

Object.defineProperty(exports, '__esModule', {
    value: true,
});

function _export(target, all) {
    for (const name in all) {
        Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name],
        });
    }
}

_export(exports, {
    trampoline: () => trampoline,

});

const Autoloader = require('./src/Autoloader');
const autoloader = new Autoloader();
autoloader.register();

require('./src/assert');
require('./src/Exception/ReflectionException');
require('./src/Reflection/ReflectionClass');
require('./src/Metadata/MetadataStorage');

const trampoline = function (filename) {
    const obj = autoloader.classLoader.loadFile(filename);

    return obj && obj.__esModule ? obj : {
        default: obj,
    };
};
