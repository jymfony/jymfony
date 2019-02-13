const Question = Jymfony.Component.Console.Question.Question;

/**
 * Represents a yes/no question.
 *
 * @memberOf Jymfony.Component.Console.Question
 */
class ConfirmationQuestion extends Question {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Output.OutputInterface} output
     * @param {string} question The question to ask to the user
     * @param {boolean} [defaultAnswer = true] The default answer to return, true or false
     * @param {RegExp} [trueAnswerRegex = /^y/i] A regex to match the "yes" answer
     */
    __construct(input, output, question, defaultAnswer = true, trueAnswerRegex = /^y/i) {
        super.__construct(input, output);

        this.question = question;
        this.defaultAnswer = defaultAnswer;

        /**
         * @type {RegExp}
         *
         * @private
         */
        this._trueAnswerRegex = trueAnswerRegex;
        this.normalizer = this._getDefaultNormalizer();
    }

    /**
     * Returns the default answer normalizer.
     *
     * @returns {Function}
     */
    _getDefaultNormalizer() {
        const defaultAnswer = this._default;
        const regex = this._trueAnswerRegex;

        return (answer) => {
            if (isBoolean(answer)) {
                return answer;
            }

            const answerIsTrue = answer.match(regex);
            if (false === defaultAnswer) {
                return answer && answerIsTrue;
            }

            return !answer || answerIsTrue;
        };
    }
}

module.exports = ConfirmationQuestion;
