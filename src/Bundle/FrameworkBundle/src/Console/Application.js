const BaseApplication = Jymfony.Component.Console.Application;
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
         *
         * @private
         */
        this._kernel = kernel;

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
     * @inheritdoc
     */
    async shutdown(exitCode) {
        await this._kernel.shutdown();

        super.shutdown(exitCode);
    }

    /**
     * @inheritdoc
     */
    getLongVersion() {
        return super.getLongVersion() + __jymfony.sprintf(
            ' (kernel: <comment>%s</comment>, env: <comment>%s</comment>, debug: <comment>%s</comment>)',
            this._kernel.getName(),
            this._kernel.environment,
            this._kernel.debug ? 'true' : 'false'
        );
    }
}

module.exports = Application;
