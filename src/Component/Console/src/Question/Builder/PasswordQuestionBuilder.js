const os = require('os');

const QuestionBuilder = Jymfony.Component.Console.Question.Builder.QuestionBuilder;
const PasswordQuestion = Jymfony.Component.Console.Question.PasswordQuestion;
const QuestionType = Jymfony.Component.Console.Question.QuestionType;

/**
 * Specialized QuestionBuilder for building PasswordQuestion objects.
 * Please do not create it directly, use {@see QuestionBuilder} instead
 *
 * @memberOf Jymfony.Component.Console.Question.Builder
 */
class PasswordQuestionBuilder extends QuestionBuilder {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Question.Builder.QuestionBuilder} builder
     */
    __construct(builder) {
        super.__construct(builder.input, builder.output);

        /**
         * @type {string}
         *
         * @private
         */
        this._type = QuestionType.PASSWORD;

        /**
         * @type {string}
         *
         * @private
         */
        this._prompt = builder._prompt;

        this.setHidden('win32' !== os.platform());

        /**
         * @type {string}
         *
         * @private
         */
        this._mask = '*';
    }

    /**
     * Sets whether the input will be hidden or masked.
     *
     * @param {boolean} hidden
     *
     * @returns {Jymfony.Component.Console.Question.Builder.PasswordQuestionBuilder}
     */
    setHidden(hidden) {
        this._hidden = hidden;

        return this;
    }

    /**
     * Sets the mask character when the input is not hidden.
     *
     * @param {string} mask
     *
     * @returns {Jymfony.Component.Console.Question.Builder.PasswordQuestionBuilder}
     */
    setMask(mask) {
        this._mask = mask;

        return this;
    }

    /**
     * @returns {Jymfony.Component.Console.Question.PasswordQuestion}
     *
     * @inheritdoc
     */
    build() {
        const question = new PasswordQuestion(this.input, this.output);
        question.question = this._prompt;
        question.normalizer = this._normalizer;
        question.validator = this._validator;
        question.hidden = this._hidden;
        question.mask = this._mask;

        return question;
    }
}

module.exports = PasswordQuestionBuilder;
