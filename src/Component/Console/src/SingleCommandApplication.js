const Application = Jymfony.Component.Console.Application;
const Command = Jymfony.Component.Console.Command.Command;

/**
 * @memberOf Jymfony.Component.Console
 */
export default class SingleCommandApplication extends Command {
    __construct(name = process.argv[1]) {
        super.__construct(name);

        /**
         * @type {string}
         *
         * @private
         */
        this._version = 'UNKNOWN';

        /**
         * @type {boolean}
         *
         * @private
         */
        this._running = false;
    }

    /**
     * Sets the application version.
     *
     * @param {string} version
     */
    set version(version) {
        this._version = version;
    }

    /**
     * @inheritdoc
     */
    async run(input = undefined, output = undefined) {
        if (this._running) {
            return super.run(input, output);
        }

        // We use the command name as the application name
        const application = new Application(this.name || 'UNKNOWN', this._version);
        this.name = process.argv[1];

        // Fix the usage of the command displayed with "--help"
        application.add(this);
        application.defaultCommand = this.name;
        application.isSingleCommand = true;

        this._running = true;
        try {
            return application.run(input, output);
        } finally {
            this._running = false;
        }
    }
}
