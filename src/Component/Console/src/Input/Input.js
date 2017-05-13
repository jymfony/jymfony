const RuntimeException = Jymfony.Component.Console.Exception.RuntimeException;
const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const StreamableInputInterface = Jymfony.Component.Console.Input.StreamableInputInterface;

/**
 * @memberOf Jymfony.Component.Console.Input
 */
class Input extends implementationOf(StreamableInputInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Input.InputDefinition} definition
     */
    __construct(definition = undefined) {
        /**
         * @type {Object.<string, *>}
         * @protected
         */
        this._arguments = {};

        /**
         * @type {Object.<string, *>}
         * @protected
         */
        this._options = {};
        this._interactive = true;

        if (! definition) {
            this._definition = new InputDefinition();
        } else {
            this.bind(definition);
            this.validate();
        }
    }

    /**
     * @inheritDoc
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
        throw new global.LogicException('You must override parse method');
    }

    /**
     * @inheritDoc
     */
    validate() {
        let definition = this._definition;
        let givenArguments = this._arguments;

        let missingArguments = definition.getArguments().map(A => A.getName()).filter(argument => {
            return ! givenArguments.hasOwnProperty(argument) && definition.getArgument(argument).isRequired();
        });

        if (0 < missingArguments.length) {
            throw new RuntimeException(`Not enough arguments (missing: "${missingArguments.join(', ')}").`);
        }
    }

    /**
     * @inheritDoc
     */
    get interactive() {
        return this._interactive;
    }

    /**
     * @inheritDoc
     */
    set interactive(interactive) {
        this._interactive = interactive;
    }

    /**
     * @inheritDoc
     */
    get arguments() {
        return Object.assign({}, this._definition.getArgumentDefaults(), this._arguments);
    }

    /**
     * @inheritDoc
     */
    getArgument(name) {
        if (! this._definition.hasArgument(name)) {
            throw new InvalidArgumentException(`The "${name}" argument does not exist.`);
        }

        return this._arguments.hasOwnProperty(name) ? this._arguments[name] : this._definition.getArgument(name).getDefault();
    }

    /**
     * @inheritDoc
     */
    setArgument(name, value) {
        if (! this._definition.hasArgument(name)) {
            throw new InvalidArgumentException(`The "${name}" argument does not exist.`);
        }

        this._arguments[name] = value;
    }

    /**
     * @inheritDoc
     */
    hasArgument(name) {
        return this._definition.hasArgument(name);
    }

    /**
     * @inheritDoc
     */
    get options() {
        return Object.assign({}, this._definition.getOptionDefaults(), this._options);
    }

    /**
     * @inheritDoc
     */
    getOption(name) {
        if (! this._definition.hasOption(name)) {
            throw new InvalidArgumentException(`The "${name}" option does not exist.`);
        }

        return this._options.hasOwnProperty(name) ? this._options[name] : this._definition.getOption(name).getDefault();
    }

    /**
     * @inheritDoc
     */
    setOption(name, value) {
        if (! this._definition.hasOption(name)) {
            throw new InvalidArgumentException(`The "${name}" option does not exist.`);
        }

        this._options[name] = value;
    }

    /**
     * {@inheritdoc}
     */
    hasOption(name) {
        return this._definition._hasOption(name);
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
     * @inheritDoc
     */
    get stream() {
        return this._stream;
    }

    /**
     * @inheritDoc
     */
    set stream(stream) {
        /**
         * @type {Jymfony.Component.Console.Input.StreamableInputInterface}
         * @private
         */
        this._stream = stream;
    }
}

module.exports = Input;
