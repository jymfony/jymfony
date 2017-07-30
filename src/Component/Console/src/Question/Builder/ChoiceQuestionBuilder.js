const QuestionBuilder = Jymfony.Component.Console.Question.Builder.QuestionBuilder;
const Choice = Jymfony.Component.Console.Question.Choice;
const ChoiceQuestion = Jymfony.Component.Console.Question.ChoiceQuestion;
const QuestionType = Jymfony.Component.Console.Question.QuestionType;

/**
 * @memberOf Jymfony.Component.Console.Question.Builder
 */
class ChoiceQuestionBuilder extends QuestionBuilder {
    __construct(builder) {
        super.__construct(builder.input, builder.output);
        this._type = QuestionType.CHOICE;
        this._choices = [];
        this._default = undefined;

        this._prompt = builder._prompt;
    }

    /**
     * Adds a choice to the builder.
     *
     * @param {string|Jymfony.Component.Console.Question.Choice} choice
     * @param {*} value
     *
     * @returns {Jymfony.Component.Console.Question.Builder.ChoiceQuestionBuilder}
     */
    addChoice(choice, value = undefined) {
        if (! (choice instanceof Choice)) {
            choice = new Choice(choice.toString(), value);
        }

        this._choices.push(choice);

        return this;
    }

    /**
     * Sets the choices of the builder.
     *
     * @param {[Jymfony.Component.Console.Question.Choice]} choices
     *
     * @returns {Jymfony.Component.Console.Question.Builder.ChoiceQuestionBuilder}
     */
    setChoices(choices) {
        if (! isArray(choices)) {
            throw new InvalidArgumentException('Choices must be an array.');
        }

        this._choices = choices.map(element => {
            if (! (element instanceof Choice)) {
                return new Choice(element.toString(), element);
            }

            return element;
        });

        return this;
    }

    /**
     * Sets the default choice.
     *
     * @param {*} defaultChoice
     *
     * @returns {Jymfony.Component.Console.Question.Builder.ChoiceQuestionBuilder}
     */
    setDefault(defaultChoice) {
        this._default = defaultChoice;

        return this;
    }

    /**
     * Sets the choice question mode.
     * Should be one of the ChoiceQuestion.MODE_* constants.
     *
     * @param {string} mode
     *
     * @returns {Jymfony.Component.Console.Question.Builder.ChoiceQuestionBuilder}
     */
    setMode(mode) {
        this._mode = mode;

        return this;
    }

    /**
     * Sets if this choice question allows multiple choices.
     *
     * @param {boolean} multiple
     *
     * @returns {Jymfony.Component.Console.Question.Builder.ChoiceQuestionBuilder}
     */
    setMultiple(multiple) {
        this._multiple = multiple;

        return this;
    }

    build() {
        let question = new ChoiceQuestion(this.input, this.output, this._choices, this._mode);
        question.multiple = this._multiple;
        question.question = this._prompt;
        question.normalizer = this._normalizer;
        question.validator = this._validator;
        question.defaultAnswer = this._default;
        question.autocompleteValues = this._autocompleteValues;

        return question;
    }
}

module.exports = ChoiceQuestionBuilder;
