declare namespace Jymfony.Component.Console.Question {
    /**
     * Represents a choice in question.
     */
    export class Choice {
        /**
         * The choice label.
         */
        public readonly label: string;

        /**
         * The choice value.
         */
        public readonly value: any;

        /**
         * Constructor.
         *
         * @param {string} label
         * @param {*} value
         */
        __construct(label: string, value: any): void;
        constructor(label: string, value: any);

        /**
         * Checks whether a choice is equal to another.
         */
        isEqual(choice: Choice): boolean;
    }
}
