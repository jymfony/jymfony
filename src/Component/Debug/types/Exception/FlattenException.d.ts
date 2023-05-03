declare namespace Jymfony.Component.Debug.Exception {
    import FlattenExceptionInterface = Jymfony.Contracts.Debug.Exception.FlattenExceptionInterface;

    export class FlattenException extends implementationOf(FlattenExceptionInterface) {
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
         * Creates a new FlattenException object
         */
        static create(exception: Error, statusCode?: number, headers?: Record<string, string>): FlattenException;

        /**
         * Gets all the previous exceptions.
         */
        public readonly allPrevious: FlattenException[];

        /**
         * The string representation of the exception.
         */
        public asString: string;
    }
}
