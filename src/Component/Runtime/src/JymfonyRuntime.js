const AwsLambdaHandlerRunner = Jymfony.Component.Runtime.Runner.Jymfony.AwsLambdaHandlerRunner;
const ConsoleApplicationRunner = Jymfony.Component.Runtime.Runner.Jymfony.ConsoleApplicationRunner;
const GenericRuntime = Jymfony.Component.Runtime.GenericRuntime;
const JymfonyErrorHandler = Jymfony.Component.Runtime.Internal.JymfonyErrorHandler;
const consoleComponentInstalled = ReflectionClass.exists('Jymfony.Component.Console.Application');
const httpServerInstalled = ReflectionClass.exists('Jymfony.Component.HttpServer.HttpServer');

function getInput(options) {
    if (! consoleComponentInstalled) {
        return undefined;
    }

    const input = new Jymfony.Component.Console.Input.ArgvInput();
    const env = input.getParameterOption([ '--env', '-e' ], null, true);
    if (null !== env) {
        process.env[options.env_var_name] = env;
    }

    if (input.hasParameterOption('--no-debug', true)) {
        process.env[options.debug_var_name] = '0';
    }

    return input;
}

/**
 * Knows the basic conventions to run Jymfony apps.
 *
 * In addition to the options managed by GenericRuntime, it accepts the following options:
 *  - "env" to define the name of the environment the app runs in;
 *  - "disable_dotenv" to disable looking for .env files;
 *  - "dotenv_path" to define the path of dot-env files - defaults to ".env";
 *  - "prod_envs" to define the names of the production envs - defaults to ["prod"];
 *  - "test_envs" to define the names of the test envs - defaults to ["test"];
 *  - "dotenv_overload" to tell Dotenv to override existing vars
 *
 * When the "debug" / "env" options are not defined, they will fallback to the
 * "APP_DEBUG" / "APP_ENV" environment variables, and to the "--env|-e" / "--no-debug"
 * command line arguments if "jymfony/console" is installed.
 *
 * When the "jymfony/dotenv" component is installed, .env files are loaded.
 * When "jymfony/debug" is installed, it is registered in debug mode.
 *
 * On top of the base arguments provided by GenericRuntime,
 * this runtime can feed the app-callable with arguments of type:
 *  - Application, Command, InputInterface and/or OutputInterface
 *    from "jymfony/console" if the component is installed.
 *
 * This runtime can handle app-callables that return instances of either:
 *  - Application,
 *  - Command,
 *  - int|string|null as handled by GenericRuntime.
 *
 * @memberof Jymfony.Component.Runtime
 */
export default class JymfonyRuntime extends GenericRuntime {
    #input;
    #output;
    #console;

    /**
     * @param {Object.<string, *>} [options = {}]
     * @param {boolean} [options.debug]
     * @param {*[]} [options.runtimes]
     * @param {string|false} [options.error_handler]
     * @param {string} [options.env_var_name]
     * @param {string} [options.debug_var_name]
     * @param {boolean} [options.disable_dotenv]
     * @param {string} [options.project_dir]
     * @param {string} [options.env]
     * @param {string} [options.dotenv_path]
     * @param {string[]} [options.prod_envs]
     * @param {string[]} [options.test_envs]
     * @param {boolean} [options.dotenv_overload]
     */
    constructor(options = {}) {
        const envKey = options.env_var_name ??= 'APP_ENV';
        const debugKey = options.debug_var_name ??= 'APP_DEBUG';

        if (!!options.env) {
            process.env[envKey] = options.env;
        }

        const prodEnvs = options.prod_envs ?? [ 'prod' ];
        const input = getInput(options);
        if (
            !(options.disable_dotenv ?? !ReflectionClass.exists('Jymfony.Component.Dotenv.Dotenv')) &&
            !!options.project_dir
        ) {
            const testEnvs = options.test_envs ?? [ 'test' ];
            try {
                (new Jymfony.Component.Dotenv.Dotenv(envKey, debugKey))
                    .setProdEnvs(isArray(prodEnvs) ? prodEnvs : [ prodEnvs ])
                    .bootEnv(options.project_dir + '/' + (options.dotenv_path ?? '.env'), 'dev', isArray(testEnvs) ? testEnvs : [ testEnvs ], options.dotenv_overload ?? false);
            } catch (e) {
                if (!(e instanceof Jymfony.Component.Dotenv.Exception.PathException)) {
                    throw e;
                }
            }

            if (consoleComponentInstalled && (options.dotenv_overload ?? false)) {
                if (input.getParameterOption([ '--env', '-e' ], process.env[envKey], true) !== process.env[envKey]) {
                    throw new LogicException(__jymfony.sprintf('Cannot use "--env" or "-e" when the "%s" file defines "%s" and the "dotenv_overload" runtime option is true.', options.dotenv_path ?? '.env', envKey));
                }

                if (process.env[debugKey] && input.hasParameterOption('--no-debug', true)) {
                    process.env[debugKey] = '0';
                }
            }

            options.debug ??= '1' === process.env[debugKey];
            options.disable_dotenv = true;
        } else {
            process.env[envKey] ??= 'dev';
            process.env[debugKey] ??= !prodEnvs.includes(process.env[envKey]);
        }

        options.error_handler ??= ReflectionClass.getClassName(JymfonyErrorHandler);
        super(options);

        this.#input = input;
    }

    getRunner(application) {
        if (consoleComponentInstalled) {
            const Application = Jymfony.Component.Console.Application;
            const Command = Jymfony.Component.Console.Command.Command;
            const ConsoleOutput = Jymfony.Component.Console.Output.ConsoleOutput;

            if (application instanceof Command) {
                const console = this.#console ??= new Application();
                console.name = application.name || console.name;

                if (!application.name || !console.has(application.name)) {
                    application.name = process.argv0;
                    console.add(application);
                }

                console.defaultCommand = application.name;
                console.definition.addOptions(application.definition.getOptions());

                return this.getRunner(console);
            }

            if (application instanceof Application) {
                const defaultEnv = !this._options.env ? (process.env[this._options.env_var_name] ?? 'dev') : undefined;
                const output = this.#output ??= new ConsoleOutput();

                return new ConsoleApplicationRunner(application, defaultEnv, this.#input, output);
            }
        }

        if (httpServerInstalled) {
            if (application instanceof Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler) {
                return new AwsLambdaHandlerRunner(application);
            }
        }

        return super.getRunner(application);
    }

    getArgument(parameterName) {
        switch (parameterName) {
            case 'input': return this.#input;
            case 'output': return this.#output ??= consoleComponentInstalled ? new Jymfony.Component.Console.Output.ConsoleOutput() : undefined;
            case 'console': return this.#console ??= consoleComponentInstalled ? new Jymfony.Component.Console.Application() : undefined;
            default: return super.getArgument(parameterName);
        }
    }

    static register(runtime) {
        const self = new JymfonyRuntime({ runtimes: {}, ...runtime._options });
        self._options.runtimes = Object.assign({
            'Jymfony.Component.Console.Application': self,
            'Jymfony.Component.Console.Command.Command': self,
            'Jymfony.Contracts.Console.InputInterface': self,
            'Jymfony.Contracts.Console.OutputInterface': self,
            'Jymfony.Component.HttpServer.Serverless.AwsLambdaHandler': self,
            // 'Jymfony.Component.HttpServer.RequestHandler': self,
        }, self._options.runtimes);
        runtime._options = __jymfony.clone(self._options);

        return self;
    }
}
