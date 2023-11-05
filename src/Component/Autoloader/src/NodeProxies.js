const { compile } = require('@jymfony/compiler');

exports.patchVm = function (vm) {
    const {
        Script,
        SourceTextModule,
        runInThisContext,
        runInContext,
        runInNewContext,
        compileFunction,
        ...newVm
    } = vm;

    newVm.Script = class extends Script {
        constructor(code, options) {
            super(compile(code), options);
        }
    };

    if (undefined !== SourceTextModule) {
        newVm.SourceTextModule = class extends SourceTextModule {
            constructor(code, options) {
                super(compile(code, null, {
                    asModule: true,
                }), options);
            }
        };
    }

    newVm.runInContext = function (code, contextifiedSandbox, options) {
        const filename = 'string' === typeof options ? options : (options || {}).filename;
        return runInContext(compile(code, filename), contextifiedSandbox, options);
    };

    newVm.runInNewContext = function (code, sandbox, options) {
        const filename = 'string' === typeof options ? options : (options || {}).filename;
        return runInNewContext(compile(code, filename), sandbox, options);
    };

    newVm.runInThisContext = function (code, options) {
        const filename = 'string' === typeof options ? options : (options || {}).filename;
        return runInThisContext(compile(code, filename), options);
    };

    newVm.compileFunction = function (code, params, options) {
        return compileFunction(compile(code, (options || {}).filename), params, options);
    };

    return newVm;
};
