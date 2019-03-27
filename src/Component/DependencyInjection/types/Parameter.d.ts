declare namespace Jymfony.Component.DependencyInjection {
    export class Parameter {
        private _id: string;

        /**
         * Constructor.
         */
        __construct(id: string): void;

        /**
         * Returns the variable name.
         */
        toString(): string;
    }
}
