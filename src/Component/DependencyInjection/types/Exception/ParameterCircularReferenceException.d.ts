declare namespace Jymfony.Component.DependencyInjection.Exception {
    export class ParameterCircularReferenceException extends RuntimeException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(parameters: string[]): void;
        constructor(parameters: string[]);
    }
}
