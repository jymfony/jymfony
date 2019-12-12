declare namespace __jymfony {
    export class Platform {
        /**
         * Checks if this node version has async function support.
         */
        static hasAsyncFunctionSupport(): boolean;

        /**
         * Checks if this node version has async generator function support.
         */
        static hasAsyncGeneratorFunctionSupport(): boolean;

        /**
         * Checks if this node version has native decorators support.
         */
        static hasNativeDecoratorsSupport(): boolean;

        /**
         * Are we running on windows?
         */
        static isWindows(): boolean;

        /**
         * Checks if this node version has modern regex (named groups) support.
         */
        static hasModernRegex(): boolean;

        /**
         * Checks if this node version has public instance fields support.
         */
        static hasPublicFieldSupport(): boolean;

        /**
         * Checks if this node version has private instance fields support.
         */
        static hasPrivateFieldSupport(): boolean;

        /**
         * Checks if this node version has private instance fields support.
         */
        static hasPrivateMethodsSupport(): boolean;
    }
}
