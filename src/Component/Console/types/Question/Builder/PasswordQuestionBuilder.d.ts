declare namespace Jymfony.Component.Console.Question.Builder {
    /**
     * Specialized QuestionBuilder for building PasswordQuestion objects.
     * Please do not create it directly, use {@see QuestionBuilder} instead
     */
    export class PasswordQuestionBuilder extends QuestionBuilder {
        private _type: string;
        private _prompt: string;
        private _mask: string;
        private _hidden: boolean;

        /**
         * Constructor.
         *
         * @param {Jymfony.Component.Console.Question.Builder.QuestionBuilder} builder
         */
        // @ts-ignore
        __construct(builder: QuestionBuilder): void;
        constructor(builder: QuestionBuilder);

        /**
         * Sets whether the input will be hidden or masked.
         */
        setHidden(hidden: boolean): this;

        /**
         * Sets the mask character when the input is not hidden.
         */
        setMask(mask: string): this;

        build(): PasswordQuestion;
    }
}
