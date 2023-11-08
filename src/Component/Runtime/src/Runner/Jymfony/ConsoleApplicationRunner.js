const InputOption = Jymfony.Component.Console.Input.InputOption;
const RunnerInterface = Jymfony.Component.Runtime.RunnerInterface;

/**
 * @memberof Jymfony.Component.Runtime.Runner.Jymfony
 */
export default class ConsoleApplicationRunner extends implementationOf(RunnerInterface) {
    /**
     * @type {Jymfony.Component.Console.Application}
     */
    #application;

    /**
     * @type {string|null}
     */
    #defaultEnv;

    /**
     * @type {Jymfony.Contracts.Console.InputInterface}
     */
    #input;

    /**
     * @type {Jymfony.Contracts.Console.OutputInterface}
     */
    #output;

    /**
     * @param {Jymfony.Component.Console.Application} application
     * @param {string|null} defaultEnv
     * @param {Jymfony.Contracts.Console.InputInterface} input
     * @param {Jymfony.Contracts.Console.OutputInterface} [output = null]
     */
    constructor(application, defaultEnv, input, output = undefined) {
        super();
        this.#application = application;
        this.#defaultEnv = defaultEnv;
        this.#input = input;
        this.#output = output;
    }

    run() {
        if (null === this.#defaultEnv) {
            return this.#application.run(this.#input, this.#output);
        }

        const definition = this.#application.definition;

        if (!definition.hasOption('env') && !definition.hasOption('e') && !definition.hasShortcut('e')) {
            definition.addOption(new InputOption('--env', '-e', InputOption.VALUE_REQUIRED, 'The Environment name.', this.#defaultEnv));
        }

        if (!definition.hasOption('no-debug')) {
            definition.addOption(new InputOption('--no-debug', null, InputOption.VALUE_NONE, 'Switches off debug mode.'));
        }

        return this.#application.run(this.#input, this.#output);
    }
}
