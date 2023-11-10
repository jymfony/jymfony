const { dirname } = require('path');
require('async_hooks').createHook({ init: () => {} }).enable();

let trampoline;

try {
    trampoline = require('@jymfony/autoloader').trampoline;
} catch (e) {
    if ('MODULE_NOT_FOUND' === e.code) {
        trampoline = require(__dirname + '/../Autoloader').trampoline;
    } else {
        throw e;
    }
}

const nullish = (value, cond) => ((undefined === value) || (null === value)) ? cond() : value;
const file = require.main.filename;

delete require.cache[file];
const mainExports = trampoline(file);
let runtime = nullish(process.env.APP_RUNTIME, () => Jymfony.Component.Runtime.JymfonyRuntime);
const reflection = new ReflectionClass(runtime);

runtime = reflection.newInstance(Object.assign({ project_dir: dirname(file) }, nullish(globalThis.APP_RUNTIME_OPTIONS, () => ({}))));

let [ app, args ] = runtime.getResolver(mainExports['default']).resolve();
(async function () {
    app = await app(...args);

    return runtime.getRunner(app).run();
}()).then(process.exit, console.error);
