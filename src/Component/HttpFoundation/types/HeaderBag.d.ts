declare namespace Jymfony.Component.HttpFoundation {
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;

    export class HeaderBag implements Iterable<[string, string[]]> {
        protected _headers: Record<string, string[]>;
        protected _cacheControl: Record<string, number | string | boolean>;

        /**
         * Constructor.
         */
        __construct(headers?: Record<string, string | string[]>): void;
        constructor(headers?: Record<string, string | string[]>);

        /**
         * Returns the headers as a string.
         */
        toString(): string;

        /**
         * Gets a copy of the parameters collection.
         *
         * @returns {Object.<string, *>}
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
         *
         * @param {string} key
         */
        remove(key: string): void;

        /**
         * Returns the HTTP header value converted to a date.
         *
         * @param key The parameter key
         * @param [defaultValue] The default value
         *
         * @returns The parsed DateTime or the default value if the header does not exist
         *
         * @throws {RuntimeException} When the HTTP header is not parseable
         */
        getDate(key: string, defaultValue?: DateTimeInterface | undefined): DateTimeInterface;

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

        /**
         * Parses a Cache-Control HTTP header.
         *
         * @param header The value of the Cache-Control HTTP header
         *
         * @returns An object representing the attribute values
         */
        protected _parseCacheControl(header: string): Record<string, number | string | boolean>;
    }
}
