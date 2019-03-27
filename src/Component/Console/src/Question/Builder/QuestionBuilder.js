const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const Question = Jymfony.Component.Console.Question.Question;
const QuestionType = Jymfony.Component.Console.Question.QuestionType;
const ChoiceQuestionBuilder = Jymfony.Component.Console.Question.Builder.ChoiceQuestionBuilder;
const PasswordQuestionBuilder = Jymfony.Component.Console.Question.Builder.PasswordQuestionBuilder;

/**
 * Helper class to easily build Question objects.
 *
 * @memberOf Jymfony.Component.Console.Question.Builder
 */
class QuestionBuilder {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     */
    __construct(input, output) {
        /**
         * @type {Jymfony.Component.Console.Input.InputInterface}
         */
        this.input = input;

        /**
         * @type {Jymfony.Component.Console.Output.OutputInterface}
         */
        this.output = output;

        /**
         * Question type from QuestionType enum.
         *
         * @type {string}
         *
         * @private
         */
        this._type = QuestionType.QUESTION;
    }

    /**
     * Creates a new QuestionBuilder object.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     *
     * @returns {Jymfony.Component.Console.Question.Builder.QuestionBuilder}
     */
    static create(input, output) {
        return new QuestionBuilder(input, output);
    }

    /**
     * Sets the question type.
     *
     * @param {string} type
     *
     * @returns {Jymfony.Component.Console.Question.Builder.QuestionBuilder}
     */
    setType(type) {
        switch (type) {
            case QuestionType.CHOICE: {
                return new ChoiceQuestionBuilder(this);
            }

            case QuestionType.PASSWORD: {
                return new PasswordQuestionBuilder(this);
            }

            default: {
                this._type = type;
            } break;
        }

        return this;
    }

    /**
     * Sets the prompt shown to the user.
     *
     * @param {string} prompt
     *
     * @returns {Jymfony.Component.Console.Question.Builder.QuestionBuilder}
     */
    setPrompt(prompt) {
        this._prompt = prompt;

        return this;
    }

    /**
     * Sets the normalizer for the question value.
     * NOTE that it will be called before input validation.
     *
     * @param {undefined|Function} normalizer
     *
     * @returns {Jymfony.Component.Console.Question.Builder.QuestionBuilder}
     */
    setNormalizer(normalizer) {
        if (undefined !== normalizer && ! isFunction(normalizer)) {
            throw new InvalidArgumentException('Normalizer must be a function.');
        }

        /**
         * Value normalizer.
         *
         * @type {Function}
         *
         * @protected
         */
        this._normalizer = normalizer;

        return this;
    }

    /**
     * Sets the validator function.
     * The function should throw an instance of InvalidArgumentException.
     * In case another exception or error is thrown it will be propagated
     * to the Application.
     *
     * @param validator
     *
     * @returns {Jymfony.Component.Console.Question.Builder.QuestionBuilder}
     */
    setValidator(validator) {
        if (undefined !== validator && ! isFunction(validator)) {
            throw new InvalidArgumentException('Validator must be a function.');
        }

        /**
         * Value validator.
         *
         * @type {Function}
         *
         * @protected
         */
        this._validator = validator;

        return this;
    }

    /**
     * Sets the iterable for the autocomplete values.
     *
     * @param {undefined|Iterable.<string>} autocompleterValues
     */
    setAutocompleteValues(autocompleterValues) {
        this._autocompleteValues = autocompleterValues;

        return this;
    }

    /**
     * Sets the default answer for the question.
     *
     * @param {*} defaultAnswer
     */
    setDefault(defaultAnswer) {
        this._default = defaultAnswer;

        return this;
    }

    /**
     * Builds the Question object.
     *
     * @returns {Jymfony.Component.Console.Question.Question}
     */
    build() {
        const question = new Question(this.input, this.output);
        question.question = this._prompt;
        question.normalizer = this._normalizer;
        question.validator = this._validator;
        question.defaultAnswer = this._default;
        question.autocompleteValues = this._autocompleteValues;

        return question;
    }
}

module.exports = QuestionBuilder;
