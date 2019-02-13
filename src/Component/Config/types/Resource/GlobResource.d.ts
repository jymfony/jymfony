declare namespace Jymfony.Component.Config.Resource {
    export class GlobResource extends implementationOf(SelfCheckingResourceInterface) {
        /**
         * The glob prefix.
         */
        public readonly prefix: string;

        private _prefix: boolean | string;
        private _pattern: string;
        private _excludedPrefixes: string[];
        private _hash: undefined | string;

        /**
         * Constructor.
         */
        __construct(prefix: string, pattern: string, excludedPrefixes?: string[]): void;
        constructor(prefix: string, pattern: string, excludedPrefixes?: string[]);

        __sleep(): string[];

        /**
         * Gets the string representation of this resource.
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        isFresh(): boolean;

        /**
         * Gets an iterator on the provided prefix and glob.
         */
        [Symbol.iterator](): IterableIterator<string>;

        /**
         * Returns a RegExp which is the equivalent of the glob pattern.
         */
        static globToRegex(glob: string, strictLeadingDot?: boolean, strictWildcardSlash?: boolean): RegExp;

        /**
         * Computes glob resource hash.
         */
        private _computeHash(): string;
    }
}
