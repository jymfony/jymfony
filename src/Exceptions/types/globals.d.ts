/// <reference lib="es2015" />

type StackTraceRecord = {
    [key: string]: string;
}

declare global {
    class Exception extends Error {
        name: string;
        previous?: Exception | Error;
        code: number;

        /**
         * The parsed stack trace for this exception.
         */
        readonly stackTrace: StackTraceRecord[];

        /**
         * The exception message.
         */
        message: string;

        /**
         * Constructor.
         */
        __construct(message?: string, code?: number, previous?: Error): void;
        constructor(message?: string, code?: number, previous?: Error);

        /**
         * Parses the stack trace of the given error and
         * returns it as an key-value object.
         */
        static parseStackTrace(error: Error): StackTraceRecord[];

        private _message: string;
        private _stackTrace: Record<string, string>[];
        private _originalStack: string;
    }

    class BadMethodCallException extends Exception {}
    class DomainException extends Exception {}
    class InvalidArgumentException extends Exception {}
    class LogicException extends Exception {}
    class OutOfBoundsException extends Exception {}
    class RuntimeException extends Exception {}
    class UnderflowException extends Exception {}
    class UnexpectedValueException extends Exception {}

    namespace NodeJS {
        interface Global {
            Exception: Newable<Exception>;
            BadMethodCallException: Newable<BadMethodCallException>;
            DomainException: Newable<DomainException>;
            InvalidArgumentException: Newable<InvalidArgumentException>;
            LogicException: Newable<LogicException>;
            OutOfBoundsException: Newable<OutOfBoundsException>;
            RuntimeException: Newable<RuntimeException>;
            UnderflowException: Newable<UnderflowException>;
            UnexpectedValueException: Newable<UnexpectedValueException>;
        }
    }
}

export {};
