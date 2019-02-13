declare namespace Jymfony.Component.Debug.Exception {
    export class FlattenException {
        public message?: string;
        public code?: number;
        public statusCode?: number;
        public headers?: Record<string, string>;
        public trace?: string[];
        public class?: string;
        public file?: string;
        public line?: number;
        public previous?: Error;

        /**
         * Creates a new FlattenException object
         */
        static create(exception: Error|Exception, statusCode?: number, headers?: Record<string, string>): FlattenException;
    }
}
