const Question = Jymfony.Component.Console.Question.Question;
const PasswordRenderer = Jymfony.Component.Console.Question.Renderer.PasswordRenderer;
const SttyPasswordRenderer = Jymfony.Component.Console.Question.Renderer.SttyPasswordRenderer;
const Terminal = Jymfony.Component.Console.Terminal;

/**
 * Represents a question with choices
 * It is strongly recommended to create a question with the help of a
 * QuestionBuilder object
 *
 * @memberOf Jymfony.Component.Console.Question
 */
export default class PasswordQuestion extends Question {
    /**
     * @inheritdoc
     */
    __construct(input, output) {
        super.__construct(input, output);

        /**
         * If the input should be hidden.
         *
         * @type {boolean}
         */
        this.hidden = true;

        /**
         * Mask character if input is not hidden.
         *
         * @type {string}
         */
        this.mask = '*';
    }

    /**
     * @inheritdoc
     */
    _getRenderer() {
        if (! this.hidden || ! this._output.stream.isTTY || ! Terminal.hasSttyAvailable()) {
            return new PasswordRenderer(this);
        }

        return new SttyPasswordRenderer(this);
    }
}
