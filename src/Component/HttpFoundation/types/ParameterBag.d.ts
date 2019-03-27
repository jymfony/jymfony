declare namespace Jymfony.Component.HttpFoundation {
    export class ParameterBag implements Iterable<[string, any]> {
        private _parameters: Record<string, any>;

        /**
         * Constructor.
         */
        __construct(parameters?: Record<string, any>): void;
        constructor(parameters?: Record<string, any>);

        /**
         * Gets a copy of the parameters collection.
         */
        public readonly all: Record<string, any>;

        /**
         * Gets the parameters keys.
         */
        public readonly keys: string[];

        /**
         * Adds/replaces parameters in the bag.
         */
        add(parameters: Record<string, any>): void;

        /**
         * Gets a parameter or returns the default if the parameter is non existent.
         */
        get(key: string, defaultValue?: any): any | undefined;

        /**
         * Sets/overwrite a parameter in the bag.
         */
        set(key: string, value: any): void;

        /**
         * Checks whether a parameter is present in the bag.
         */
        has(key: string): boolean;

        /**
         * Deletes a parameter.
         */
        remove(key: string): void;

        /**
         * Gets a key/value iterator.
         */
        [Symbol.iterator](): IterableIterator<[string, any]>;

        /**
         * Gets the number of elements in the bag.
         */
        public readonly length: number;
    }
}
