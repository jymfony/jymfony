import { getArgumentNames } from '@jymfony/compiler';

const ClosureResolver = Jymfony.Component.Runtime.Resolver.ClosureResolver;
const ClosureRunner = Jymfony.Component.Runtime.Runner.ClosureRunner;
const RunnerInterface = Jymfony.Component.Runtime.RunnerInterface;
const RuntimeInterface = Jymfony.Component.Runtime.RuntimeInterface;

/**
 * A runtime to do normalize engine behavior.
 *
 * It supports the following options:
 *  - "debug" toggles displaying errors and defaults
 *    to the "APP_DEBUG" environment variable;
 *  - "runtimes" maps types to a GenericRuntime implementation
 *    that knows how to deal with each of them;
 *  - "error_handler" defines the class to use to handle errors;
 *  - "env_var_name" and "debug_var_name" define the name of the env
 *    vars that hold the Symfony env and the debug flag respectively.
 *
 * The app-callable can declare arguments among either:
 * - "env" to get an object containing all the environment variables;
 * - "argv" to get the command line arguments when running on the CLI;
 *
 * It should return a function():int|string|null or an instance of RunnerInterface.
 *
 * In debug mode, the runtime registers a strict error handler
 * that throws exceptions when a warning/notice is raised.
 *
 * @memberof Jymfony.Component.Runtime
 */
export default class GenericRuntime extends implementationOf(RuntimeInterface) {
    _options;

    /**
     * @param {Object.<string, *>} [options = {}]
     * @param {boolean} [options.debug]
     * @param {*[]} [options.runtimes]
     * @param {string|false} [options.error_handler]
     * @param {string} [options.env_var_name]
     * @param {string} [options.debug_var_name]
     */
    constructor(options = {}) {
        super();

        options.env_var_name ??= 'APP_ENV';
        const debugKey = options.debug_var_name ??= 'APP_DEBUG';
        const debug = !!(options.debug ?? process.env[debugKey] ?? true);

        if (debug) {
            process.umask(0);
            process.env[debugKey] = '1';

            const errorHandler = options.error_handler ?? ReflectionClass.getClassName(BasicErrorHandler);
            if (false !== errorHandler) {
                const refl = new ReflectionClass(errorHandler);
                refl.getMethod('register').invoke(null, debug);
                options.error_handler = false;
            }
        } else {
            process.env[debugKey] = '1';
        }

        this._options = { runtimes: {}, ...options };
    }

    /**
     * @param {Function} callable
     *
     * @returns {Jymfony.Component.Runtime.Resolver.ResolverInterface}
     */
    getResolver(callable) {
        const parameters = getArgumentNames(callable.toString());
        if (process.env[this._options.debug_var_name]) {
            // TODO
            // Return new DebugClosureResolver(callable, parameters);
        }

        return new ClosureResolver(callable, () => parameters.map(this.getArgument.bind(this)));
    }

    /**
     * @param {object} application
     *
     * @return {RunnerInterface}
     */
    getRunner(application = null) {
        application ??= function () {
            return 0;
        };

        if (application instanceof RunnerInterface) {
            return application;
        }

        if (!isFunction(application)) {
            const runtime = this._resolveRuntime(application);
            if (!!runtime) {
                return runtime.getRunner(application);
            }
        }

        return new ClosureRunner(application);
    }

    getArgument(parameterName) {
        switch (parameterName) {
            case 'env':
                return { ...process.env };

            case 'argv':
                return process.argv;

            case 'runtime':
                return this;
        }

        return undefined;
    }

    static register(runtime) {
        return runtime;
    }

    _getRuntime(type) {
        let runtime = this._options.runtimes[type] ?? null;
        if (null === runtime) {
            runtime = 'Jymfony.Runtime.' + type + 'Runtime';
            runtime = ReflectionClass.exists(runtime) ? runtime : this._options.runtimes[type] = false;
        }

        if (isString(runtime)) {
            const reflClass = new ReflectionClass(runtime);
            runtime = reflClass.getMethod('register').invoke(null, this);
        }

        if (this === runtime) {
            return null;
        }

        return runtime || null;
    }

    _resolveRuntime(klass) {
        let runtime = this._getRuntime(klass);
        if (!!runtime) {
            return runtime;
        }

        const reflClass = new ReflectionClass(klass);
        let type = reflClass;
        while ((type = type.getParentClass())) {
            runtime = this._getRuntime(type.name);
            if (!!runtime) {
                return runtime;
            }
        }

        for (const type of reflClass.interfaces) {
            runtime = this._getRuntime(type.name);
            if (!!runtime) {
                return runtime;
            }
        }

        return null;
    }
}
