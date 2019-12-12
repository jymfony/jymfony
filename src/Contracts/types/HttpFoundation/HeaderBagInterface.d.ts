declare namespace Jymfony.Contracts.HttpFoundation {
    export class HeaderBagInterface implements MixinInterface, Iterable<[string, string[]]> {
        public static readonly definition: Newable<HeaderBagInterface>;

        /**
         * Returns the headers as a string.
         */
        toString(): string;

        /**
         * Gets a copy of the parameters collection.
         */
        public readonly all: Record<string, string[]>;

        /**
         * Gets the parameters keys.
         */
        public readonly keys: string[];

        /**
         * Adds/replaces parameters in the bag.
         */
        add(parameters: Record<string, string | string[]>): void;

        /**
         * Gets a parameter or returns the default if the parameter is non existent.
         */
        get(key: string, defaultValue?: string, first?: true): string;
        get(key: string, defaultValue?: any, first?: true): any;
        get(key: string, defaultValue?: string | string[], first?: false): string[];
        get(key: string, defaultValue?: any | any[], first?: false): any[];

        /**
         * Sets/overwrite a parameter in the bag.
         */
        set(key: string, values: string | string[], replace?: boolean): void;

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
        [Symbol.iterator](): IterableIterator<[string, string[]]>;

        /**
         * Gets the number of elements in the bag.
         */
        public readonly length: number;

        public readonly cookies: Record<string, string>;

        /**
         * Adds a custom Cache-Control directive.
         *
         * @param key The Cache-Control directive name
         * @param value The Cache-Control directive value
         */
        addCacheControlDirective(key: string, value?: boolean): void;

        /**
         * Returns true if the Cache-Control directive is defined.
         *
         * @param key The Cache-Control directive
         *
         * @returns true if the directive exists, false otherwise
         */
        hasCacheControlDirective(key: string): boolean;

        /**
         * Returns a Cache-Control directive value by name.
         *
         * @param key The directive name
         *
         * @returns The directive value if defined, undefined otherwise
         */
        getCacheControlDirective(key: string): any;

        /**
         * Removes a Cache-Control directive.
         *
         * @param key The Cache-Control directive
         */
        removeCacheControlDirective(key: string): void;

        public readonly cacheControlHeader: string;
    }
}
