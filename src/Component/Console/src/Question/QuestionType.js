/**
 * @memberOf Jymfony.Component.Console.Question
 *
 * @enum
 *
 * @final
 */
export default class QuestionType {
    /**
     * Constructor.
     */
    constructor() {
        throw new LogicException('This class cannot be constructed');
    }
}

QuestionType.QUESTION = 'question';
QuestionType.PASSWORD = 'password';
QuestionType.CHOICE = 'choice';
