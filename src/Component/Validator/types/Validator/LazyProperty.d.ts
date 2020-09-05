declare namespace Jymfony.Component.Validator.Validator {
    /**
     * A wrapper for a callable initializing a property from a getter.
     *
     * @internal
     */
    export class LazyProperty<T = any, TParams extends any[] = any[]> {
        private _propertyValueCallback: (...args: TParams) => T;

        /**
         * Constructor.
         */
        __construct(propertyValueCallback: (...args: TParams) => T): void;
        constructor(propertyValueCallback: (...args: TParams) => T);

        getPropertyValue(): T;
    }
}
