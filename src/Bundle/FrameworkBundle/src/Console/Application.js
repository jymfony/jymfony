const BaseApplication = Jymfony.Component.Console.Application;
const KernelInterface = Jymfony.Component.Kernel.KernelInterface;
const Kernel = Jymfony.Component.Kernel.Kernel;
const InputOption = Jymfony.Component.Console.Input.InputOption;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Console
 */
class Application extends BaseApplication {

    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Kernel.KernelInterface} kernel A KernelInterface instance
     */
    __construct(kernel) {
        /**
         * @type {Jymfony.Component.Kernel.KernelInterface}
         * @private
         */
        this._kernel = kernel;

        /**
         * @type {boolean}
         * @private
         */
        this._commandsRegistered = false;

        super.__construct('Jymfony', Kernel.VERSION);
        this.definition.addOption(new InputOption('--env', '-e', InputOption.VALUE_REQUIRED, 'The environment name', kernel.environment));
        this.definition.addOption(new InputOption('--no-debug', undefined, InputOption.VALUE_NONE, 'Switches off debug mode'));
    }

    /**
     * Gets the Kernel associated with this Console.
     *
     * @returns {Jymfony.Component.Kernel.KernelInterface} A KernelInterface instance
     */
    get kernel() {
        return this._kernel;
    }

    /**
     * Runs the current application.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input An Input instance
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An Output instance
     *
     * @returns {int} 0 if everything went fine, or an error code
     *
     * @protected
     */
    * _doRun(input, output) {
        this._kernel.boot();
        this.dispatcher = this._kernel.container.get('event_dispatcher');

        return yield * super._doRun(input, output);
    }

    /**
     * @inheritDoc
     */
    find(name) {
        this._registerCommands();

        return super.find(name);
    }

    /**
     * @inheritDoc
     */
    get(name) {
        this._registerCommands();

        return super.get(name);
    }

    /**
     * @inheritDoc
     */
    all(namespace = undefined) {
        this._registerCommands();

        return super.all(namespace);
    }

    /**
     * @inheritDoc
     */
    getLongVersion() {
        return super.getLongVersion() + __jymfony.sprintf(
            ' (kernel: <comment>%s</comment>, env: <comment>%s</comment>, debug: <comment>%s</comment>)',
            this._kernel.getName(),
            this._kernel.environment,
            this._kernel.debug ? 'true' : 'false'
        );
    }

    /**
     * @inheritDoc
     */
    add(command) {
        this._registerCommands();

        return super.add(command);
    }

    /**
     * Registers every {@see Jymfony.Component.Console.Command} command in 'console.command.ids'
     * parameter (processed by {@see Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler.AddConsoleCommandPass}
     * in the current {@see Jymfony.Component.DependencyInjection.Container} instance.
     *
     * @protected
     */
    _registerCommands() {
        if (this.commandsRegistered) {
            return;
        }

        this.commandsRegistered = true;

        this._kernel.boot();

        if (this._kernel.container.hasParameter('console.command.ids')) {
            for (let id of this._kernel.container.getParameter('console.command.ids')) {
                this.add(this._kernel.container.get(id));
            }
        }
    }
}

module.exports = Application;
