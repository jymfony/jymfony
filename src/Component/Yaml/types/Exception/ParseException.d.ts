declare namespace Jymfony.Component.Yaml.Exception {
    /**
     * Exception class thrown when an error occurs during parsing.
     *
     * @memberOf Jymfony.Component.Yaml.Exception
     */
    export class ParseException extends RuntimeException {
        private _parsedFile: string;
        private _parsedLine: number;
        private _snippet: string;
        private _rawMessage: string;
        private _message: null;

        /**
         * Constructor.
         *
         * @param message The error message
         * @param [parsedLine = -1] The line where the error occurred
         * @param [snippet] The snippet of code near the problem
         * @param [parsedFile] The file name where the error occurred
         * @param [previous] The previous exception
         */
        // @ts-ignore
        __construct(message: string, parsedLine?: number, snippet?: string, parsedFile?: string, previous?: Error): void;
        constructor(message: string, parsedLine?: number, snippet?: string, parsedFile?: string, previous?: Error);

        /**
         * Gets/sets the snippet of code near the error.
         */
        public snippet: string;

        /**
         * Gets the filename where the error occurred.
         */
        public parsedFile: string;

        /**
         * Gets the line where the error occurred.
         */
        public parsedLine: number;

        private _updateRepr(): void;
    }
}
