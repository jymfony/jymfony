const StreamableInputInterface = Jymfony.Component.Console.Input.StreamableInputInterface;
const CheckboxRenderer = Jymfony.Component.Console.Question.Renderer.CheckboxRenderer;
const ListRenderer = Jymfony.Component.Console.Question.Renderer.ListRenderer;
const RawListRenderer = Jymfony.Component.Console.Question.Renderer.RawListRenderer;
const Question = Jymfony.Component.Console.Question.Question;

/**
 * Represents a question with choices
 * It is strongly recommended to create a question with the help of a
 * QuestionBuilder object
 *
 * @memberOf Jymfony.Component.Console.Question
 */
export default class ChoiceQuestion extends Question {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     * @param {Jymfony.Component.Console.Question.Choice[]} choices
     * @param {string} [mode = Jymfony.Component.Console.Question.ChoiceQuestion.MODE_LIST]
     */
    __construct(input, output, choices, mode = ChoiceQuestion.MODE_LIST) {
        super.__construct(input, output);

        this.choices = choices;
        this.multiple = false;

        /**
         * The current question mode. Should be one of
         * the ChoiceQuestion.MODE_* constants.
         *
         * @type {string}
         */
        this.mode = mode;
    }

    /**
     * Sets the choices.
     *
     * @param {Jymfony.Component.Console.Question.Choice[]} choices
     */
    set choices(choices) {
        /**
         * The current question choices.
         *
         * @type {Jymfony.Component.Console.Question.Choice[]}
         *
         * @private
         */
        this._choices = choices;
    }

    /**
     * Gets the choices.
     *
     * @returns {Jymfony.Component.Console.Question.Choice[]}
     */
    get choices() {
        return [ ...this._choices ];
    }

    /**
     * Sets if this question is a multiselect choice.
     *
     * @param {boolean} multiple
     */
    set multiple(multiple) {
        /**
         * Whether the question allows multiple choices as answer.
         *
         * @type {boolean}
         *
         * @private
         */
        this._multiple = !! multiple;
    }

    /**
     * Whether this question is a multi-choice.
     *
     * @returns {boolean}
     */
    get multiple() {
        return this._multiple;
    }

    /**
     * @inheritdoc
     */
    ask() {
        const input = (this._input instanceof StreamableInputInterface ? this._input.stream : undefined) || process.stdin;
        if (! input.isTTY || ! this._output.stream.isTTY) {
            // Fallback to rawlist
            this.mode = ChoiceQuestion.MODE_RAWLIST;
        }

        return super.ask();
    }

    /**
     * @inheritdoc
     */
    _getRenderer() {
        switch (this.mode) {
            case ChoiceQuestion.MODE_LIST: {
                return this.multiple ? new CheckboxRenderer(this) : new ListRenderer(this);
            }

            case ChoiceQuestion.MODE_RAWLIST: {
                return new RawListRenderer(this);
            }

            default: {
                throw new InvalidArgumentException('Unknown choice mode "'+this.mode.toString()+'"');
            }
        }
    }
}

ChoiceQuestion.MODE_LIST = 'list';
ChoiceQuestion.MODE_RAWLIST = 'raw_list';
