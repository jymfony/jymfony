declare namespace Jymfony.Component.DependencyInjection {
    export class Variable {
        /**
         * Constructor.
         */
        __construct(name: string): void;
        constructor(name: string);

        /**
         * Returns the variable name.
         */
        toString(): string;
    }
}
