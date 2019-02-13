declare namespace Jymfony.Component.HttpFoundation {
    export class ResponseHeaderBag extends HeaderBag {
        public static readonly DISPOSITION_ATTACHMENT = 'attachment';
        public static readonly DISPOSITION_INLINE = 'inline';

        /**
         * Define the case of header names.
         */
        protected _headerNames: Record<string, string>;

        /**
         * Cookies of the response.
         */
        private _cookies: Record<string, Record<string, Record<string, Cookie>>>;

        /**
         * Computed cache-control header.
         */
        private _computedCacheControl: Record<string, number | string | boolean>;

        /**
         * Constructor.
         */
        __construct(headers?: Record<string, string | string[]>): void;
        constructor(headers?: Record<string, string | string[]>);

        /**
         * @inheritdoc
         */
        set(key: string, values: string | string[], replace?: boolean): void;

        /**
         * @inheritdoc
         */
        hasCacheControlDirective(key: string): boolean;

        /**
         * @inheritdoc
         */
        getCacheControlDirective(key: string): any;

        /**
         * Sets a cookie.
         */
        setCookie(cookie: Cookie): void;

        /**
         * Generates a HTTP Content-Disposition field-value.
         *
         * @param disposition One of "inline" or "attachment"
         * @param filename A unicode string
         * @param filenameFallback A string containing only ASCII characters that
         *                                  is semantically equivalent to $filename. If the filename is already ASCII,
         *                                  it can be omitted, or just copied from $filename
         *
         * @returns A string suitable for use as a Content-Disposition field-value
         *
         * @throws {InvalidArgumentException}
         *
         * @see RFC 6266
         */
        makeDisposition(disposition: string, filename: string, filenameFallback?: string): string;

        /**
         * Returns the calculated value of the cache-control header.
         *
         * This considers several other headers and calculates or modifies the
         * cache-control header to a sensible, conservative value.
         */
        protected _computeCacheControlValue(): string;

        private _initDate(): void;
    }
}
