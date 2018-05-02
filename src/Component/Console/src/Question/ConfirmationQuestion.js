const Question = Jymfony.Component.Console.Question.Question;

/**
 * Represents a yes/no question.
 *
 * @memberOf Jymfony.Component.Console.Question
 */
class ConfirmationQuestion extends Question {
    /**
     * @param {string} question The question to ask to the user
     * @param {boolean} [defaultAnswer = true] The default answer to return, true or false
     * @param {string} [trueAnswerRegex = /^y/i] A regex to match the "yes" answer
     */
    __construct(question, defaultAnswer = true, trueAnswerRegex = /^y/i) {
        super.__construct(question, defaultAnswer);

        /**
         * @type {string}
         * @private
         */
        this._trueAnswerRegex = trueAnswerRegex;
        this.normalizer = this._getDefaultNormalizer();
    }

    /**
     * Returns the default answer normalizer.
     *
     * @return {function(*): *}
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
