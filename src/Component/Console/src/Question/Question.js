const FormatterHelper = Jymfony.Component.Console.Helper.FormatterHelper;
const ReadlineRenderer = Jymfony.Component.Console.Question.Renderer.ReadlineRenderer;

/**
 * Represents a console question
 * It is strongly recommended to create a question with the help of a
 * QuestionBuilder object
 *
 * @memberOf Jymfony.Component.Console.Question
 */
class Question {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     */
    __construct(input, output) {
        /**
         * Input instance.
         *
         * @type {Jymfony.Component.Console.Input.InputInterface}
         * @protected
         */
        this._input = input;

        /**
         * Output instance
         *
         * @type {Jymfony.Component.Console.Output.OutputInterface}
         * @protected
         */
        this._output = output;

        /**
         * The question to be prompted to the user.
         *
         * @type {string}
         * @protected
         */
        this._question = '';

        /**
         * The default answer to be returned if the user enters nothing.
         *
         * @type {*}
         * @protected
         */
        this._default = undefined;

        /**
         * The answer normalizer.
         *
         * @param {function(*): *} answer
         * @protected
         */
        this._normalizer = this._getDefaultNormalizer();

        /**
         * Answer validator.
         *
         * @type {function(*): void}
         * @protected
         */
        this._validator = this._getDefaultValidator();
    }

    /**
     * Build a default normalizer.
     *
     * @returns {function(*): *}
     * @protected
     */
    _getDefaultNormalizer() {
        return answer => answer;
    }

    /**
     * Build a default validator.
     *
     * @returns {function(*): undefined}
     * @protected
     */
    _getDefaultValidator() {
        return () => {};
    }

    /**
     * Sets the question to be prompted.
     *
     * @param {string} question
     */
    set question(question) {
        this._question = question;
    }

    /**
     * Sets the default answer.
     *
     * @param {*} def
     */
    set defaultAnswer(def) {
        this._default = def;
    }

    /**
     * Sets the normalizer.
     *
     * @param {function(*): *|undefined} normalizer
     */
    set normalizer(normalizer) {
        if (undefined === normalizer) {
            normalizer = this._getDefaultNormalizer();
        }

        this._normalizer = normalizer;
    }

    /**
     * Sets the validator.
     *
     * @param {function(*): void|undefined} validator
     */
    set validator(validator) {
        if (undefined === validator) {
            validator = this._getDefaultValidator();
        }

        this._validator = validator;
    }

    /**
     * Sets the autocomplete values.
     *
     * @param {[string]} values
     */
    set autocompleteValues(values) {
        this._autocompleteValues = values;
    }

    /**
     * Ask the user for input and return the answer.
     *
     * @returns {Promise}
     */
    ask() {
        return __jymfony.Async.run(this._doAsk());
    }

    /**
     * Returns a question renderer.
     *
     * @returns {Jymfony.Component.Console.Question.Renderer.RendererInterface}
     *
     * @protected
     */
    _getRenderer() {
        return new ReadlineRenderer(this);
    }

    /**
     * Ask and validate the answer.
     *
     * @private
     */
    * _doAsk() {
        const formatter = new FormatterHelper();
        const renderer = this._getRenderer();

        do {
            let value = yield renderer.doAsk();

            value = this._normalizer(value);
            try {
                this._validator(value);
                return value;
            } catch (e) {
                if (e instanceof RuntimeException) {
                    throw e;
                }

                let err = formatter.formatBlock(e.message, 'error', true);
                this._output.writeln(err);
            }
        } while (true);
    }
}

module.exports = Question;
