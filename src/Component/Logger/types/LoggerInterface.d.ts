declare namespace Jymfony.Component.Logger {
    /**
     * Describes a logger instance.
     *
     * The message MUST be a string or object implementing toString().
     *
     * The message MAY contain placeholders in the form: {foo} where foo
     * will be replaced by the context data in key "foo".
     *
     * The context object can contain arbitrary data. The only assumption that
     * can be made by implementors is that if an Error instance is given
     * to produce a stack trace, it MUST be in a key named "error".
     */
    export class LoggerInterface {
        public static readonly definition: Newable<LoggerInterface>;

        /**
         * System is unusable.
         */
        emergency(message: string, context?: Record<string, any>): void;

        /**
         * Action must be taken immediately.
         *
         * Example: Entire website down, database unavailable, etc. This should
         * trigger the SMS alerts and wake you up.
         */
        alert(message: string, context?: Record<string, any>): void;

        /**
         * Critical conditions.
         *
         * Example: Application component unavailable, unexpected exception.
         */
        critical(message: string, context?: Record<string, any>): void;

        /**
         * Runtime errors that do not require immediate action but should typically
         * be logged and monitored.
         */
        error(message: string, context?: Record<string, any>): void;

        /**
         * Exceptional occurrences that are not errors.
         *
         * Example: Use of deprecated APIs, poor use of an API, undesirable things
         * that are not necessarily wrong.
         */
        warning(message: string, context?: Record<string, any>): void;

        /**
         * Normal but significant events.
         */
        notice(message: string, context?: Record<string, any>): void;

        /**
         * Interesting events.
         *
         * Example: User logs in, SQL logs.
         */
        info(message: string, context?: Record<string, any>): void;

        /**
         * Detailed debug information.
         */
        debug(message: string, context?: Record<string, any>): void;

        /**
         * Logs with an arbitrary level.
         */
        log(level: number, message: string, context?: Record<string, any>): void;
    }
}
