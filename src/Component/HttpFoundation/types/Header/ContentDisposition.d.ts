declare namespace Jymfony.Component.HttpFoundation.Header {
    export class ContentDisposition {
        private _type: string;
        private _parameters: Record<string, string[]>;

        /**
         * Constructor.
         */
        __construct(disposition: string): void;

        /**
         * Gets the content disposition type (ex: inline, form-data, ...)
         */
        public readonly type: string;

        /**
         * Gets a content type parameter (ex: charset).
         */
        get(parameter: string, defaultValue?: string | undefined): string | undefined;

        /**
         * Checks whether a parameter is present.
         */
        has(parameter: string): boolean;

        /**
         * Parses and validates the the content-type header.
         */
        protected _parse(disposition: string): void;
    }
}
