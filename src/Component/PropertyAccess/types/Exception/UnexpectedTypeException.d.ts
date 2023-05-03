declare namespace Jymfony.Component.PropertyAccess.Exception {
    import PropertyPathInterface = Jymfony.Contracts.PropertyAccess.PropertyPathInterface;

    export class UnexpectedTypeException extends global.RuntimeException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(value: any, propertyPath: PropertyPathInterface, index: number): void;
        constructor(value: any, propertyPath: PropertyPathInterface, index: number);
    }
}
