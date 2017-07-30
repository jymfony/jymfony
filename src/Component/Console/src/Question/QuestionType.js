/**
 * @memberOf Jymfony.Component.Console.Question
 *
 * @enum
 * @final
 */
class QuestionType {
    constructor() {
        throw new LogicException('This class cannot be constructed');
    }
}

QuestionType.QUESTION = 'question';
QuestionType.PASSWORD = 'password';
QuestionType.CHOICE = 'choice';

module.exports = QuestionType;
