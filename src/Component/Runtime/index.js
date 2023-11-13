require('async_hooks').createHook({ init: () => {} }).enable();

const { trampoline } = (() => {
    try {
        return require('@jymfony/autoloader');
    } catch (e) {
        if ('MODULE_NOT_FOUND' === e.code) {
            return require(__dirname + '/../Autoloader');
        }

        throw e;
    }
})();

const nullish = (value, cond) => ((undefined === value) || (null === value)) ? cond() : value;
const file = require.main.filename;

delete require.cache[file];
const mainExports = trampoline(file);
let runtime = nullish(process.env.APP_RUNTIME, () => Jymfony.Component.Runtime.JymfonyRuntime);
const reflection = new ReflectionClass(runtime);

runtime = reflection.newInstance(Object.assign({
    project_dir: __jymfony.autoload.finder.findRoot(),
}, nullish(globalThis.APP_RUNTIME_OPTIONS, () => ({}))));

let [ app, args ] = runtime.getResolver(mainExports['default']).resolve();
(async function () {
    app = await app(...args);

    return runtime.getRunner(app).run();
}())
    .then(exitCode => {
        process.nextTick(() => process.exit(exitCode));
    }, console.error);
