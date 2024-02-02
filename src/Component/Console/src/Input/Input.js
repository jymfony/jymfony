const RuntimeException = Jymfony.Component.Console.Exception.RuntimeException;
const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const StreamableInputInterface = Jymfony.Component.Console.Input.StreamableInputInterface;

/**
 * @memberOf Jymfony.Component.Console.Input
 */
export default class Input extends implementationOf(StreamableInputInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Input.InputDefinition} definition
     */
    __construct(definition = undefined) {
        /**
         * @type {Object.<string, *>}
         *
         * @protected
         */
        this._arguments = {};

        /**
         * @type {Object.<string, *>}
         *
         * @protected
         */
        this._options = {};

        /**
         * @type {boolean}
         *
         * @private
         */
        this._interactive = true;

        /**
         * @type {NodeJS.ReadableStream}
         *
         * @private
         */
        this._stream = undefined;

        if (! definition) {
            /**
             * @type {Jymfony.Component.Console.Input.InputDefinition}
             *
             * @private
             */
            this._definition = new InputDefinition();
        } else {
            this.bind(definition);
            this.validate();
        }
    }

    /**
     * @inheritdoc
     */
    bind(definition) {
        this._arguments = {};
        this._options = {};
        this._definition = definition;

        this.parse();
    }

    /**
     * Parses the options and arguments.
     */
    parse() {
        throw new LogicException('You must override parse method');
    }

    /**
     * @inheritdoc
     */
    validate() {
        const definition = this._definition;
        const givenArguments = this._arguments;

        const missingArguments = definition.getArguments().map(A => A.getName()).filter(argument => {
            return ! givenArguments.hasOwnProperty(argument) && definition.getArgument(argument).isRequired();
        });

        if (0 < missingArguments.length) {
            throw new RuntimeException(`Not enough arguments (missing: "${missingArguments.join(', ')}").`);
        }
    }

    /**
     * @inheritdoc
     */
    get interactive() {
        return this._interactive;
    }

    /**
     * @inheritdoc
     */
    set interactive(interactive) {
        this._interactive = interactive;
    }

    /**
     * @inheritdoc
     */
    get arguments() {
        return Object.assign({}, this._definition.getArgumentDefaults(), this._arguments);
    }

    /**
     * @inheritdoc
     */
    getArgument(name) {
        if (! this._definition.hasArgument(name)) {
            throw new InvalidArgumentException(`The "${name}" argument does not exist.`);
        }

        return this._arguments.hasOwnProperty(name) ? this._arguments[name] : this._definition.getArgument(name).getDefault();
    }

    /**
     * @inheritdoc
     */
    setArgument(name, value) {
        if (! this._definition.hasArgument(name)) {
            throw new InvalidArgumentException(`The "${name}" argument does not exist.`);
        }

        this._arguments[name] = value;
    }

    /**
     * @inheritdoc
     */
    hasArgument(name) {
        return this._definition.hasArgument(name);
    }

    /**
     * @inheritdoc
     */
    get options() {
        return Object.assign({}, this._definition.getOptionDefaults(), this._options);
    }

    /**
     * @inheritdoc
     */
    getOption(name) {
        if (this._definition.hasNegation(name)) {
            const value = this.getOption(this._definition.negationToName(name));
            if (null === value) {
                return value;
            }

            return !value;
        }

        if (! this._definition.hasOption(name)) {
            throw new InvalidArgumentException(`The "${name}" option does not exist.`);
        }

        return this._options.hasOwnProperty(name) ? this._options[name] : this._definition.getOption(name).getDefault();
    }

    /**
     * @inheritdoc
     */
    setOption(name, value) {
        if (this._definition.hasNegation(name)) {
            this._options[this._definition.negationToName(name)] = !value;

            return;
        } else if (! this._definition.hasOption(name)) {
            throw new InvalidArgumentException(`The "${name}" option does not exist.`);
        }

        this._options[name] = value;
    }

    /**
     * @inheritdoc
     */
    hasOption(name) {
        return this._definition.hasOption(name) || this._definition.hasNegation(name);
    }

    /**
     * Escapes a token through escapeshellarg if it contains unsafe chars.
     *
     * @param {string} token
     *
     * @returns {string}
     */
    escapeToken(token) {
        return /^[\w-]+$/.test(token) ? token : __jymfony.escapeshellarg(token);
    }

    /**
     * @inheritdoc
     */
    get stream() {
        return this._stream;
    }

    /**
     * @inheritdoc
     */
    set stream(stream) {
        this._stream = stream;
    }
}
