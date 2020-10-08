declare namespace Jymfony.Contracts.Cache {
    /**
     * Value holder for cache.
     */
    export class ValueHolder<T = any> {
        public value: T;

        /**
         * Constructor.
         */
        __construct(value: T): void;
        constructor(value: T);
    }
}
