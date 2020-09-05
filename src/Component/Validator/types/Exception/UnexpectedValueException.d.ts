declare namespace Jymfony.Component.Validator.Exception {
    import UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;

    export class UnexpectedValueException extends UnexpectedTypeException {
        private _expectedType: string;

        /**
         * Constructor.
         */
        __construct(value: any, expectedType: string | Newable): void;
        constructor(value: any, expectedType: string | Newable);

        public readonly expectedType: string;
    }
}
