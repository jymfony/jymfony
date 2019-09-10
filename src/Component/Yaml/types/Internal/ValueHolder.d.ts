declare namespace Jymfony.Component.Yaml.Internal {
    /**
     * Value holder for reference passing.
     */
    export class ValueHolder<T> {
        private _value: T;

        public value: T;
        public _: T;

        /**
         * Constructor.
         */
        __construct(value: T);

        /**
         * Returns the value contained in the holder.
         */
        valueOf(): T;

        /**
         * Converts to primitive.
         */
        [Symbol.toPrimitive](): T;
    }
}
