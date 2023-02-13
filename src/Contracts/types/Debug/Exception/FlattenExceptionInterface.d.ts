declare namespace Jymfony.Contracts.Debug.Exception {
    export class FlattenExceptionInterface {
        public message?: string;
        public code?: number;
        public statusCode?: number;
        public statusText?: number;
        public headers?: Record<string, string>;
        public trace?: string[];
        public traceAsString?: string;
        public class?: string;
        public file?: string;
        public line?: number;
        public previous?: Error;

        private _asString: null | string;

        /**
         * Gets all the previous exceptions.
         */
        public readonly allPrevious: FlattenExceptionInterface[];

        /**
         * The string representation of the exception.
         */
        public asString: string;
    }
}
