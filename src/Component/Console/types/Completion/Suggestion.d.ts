declare namespace Jymfony.Component.Console.Completion {
    /**
     * Represents a single suggested value.
     */
    export class Suggestion {
        private _value: string;

        /**
         * Constructor.
         */
        __construct(value: string): void;
        constructor(value: string);

        public readonly value: string;

        toString(): string;
    }
}
