declare namespace Jymfony.Component.Validator.Exception {
    import ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

    export class UnexpectedTypeException extends ValidatorException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(value: any, expectedType: string | Newable): void;
        constructor(value: any, expectedType: string | Newable);
    }
}
