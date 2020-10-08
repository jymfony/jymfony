declare namespace Jymfony.Component.Validator.Exception {
    import ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

    export class InvalidOptionsException extends ValidatorException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, options: string[]): void;
        constructor(message: string, options: string[]);

        public readonly options: string[];
    }
}
