declare namespace Jymfony.Component.PropertyAccess.Exception {
    export class UnexpectedTypeException extends RuntimeException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(value: any, propertyPath: PropertyPathInterface, index: number): void;
        constructor(value: any, propertyPath: PropertyPathInterface, index: number);
    }
}
