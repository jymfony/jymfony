/// <reference lib="es2015" />

type StackTraceRecord = {
    [key: string]: string;
}

declare class Exception extends Error {
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

declare class BadMethodCallException extends Exception {}
declare class DomainException extends Exception {}
declare class InvalidArgumentException extends Exception {}
declare class LogicException extends Exception {}
declare class OutOfBoundsException extends Exception {}
declare class RuntimeException extends Exception {}
declare class UnderflowException extends Exception {}
declare class UnexpectedValueException extends Exception {}

declare global {
    var Exception: Newable<Exception>;
    var BadMethodCallException: Newable<BadMethodCallException>;
    var DomainException: Newable<DomainException>;
    var InvalidArgumentException: Newable<InvalidArgumentException>;
    var LogicException: Newable<LogicException>;
    var OutOfBoundsException: Newable<OutOfBoundsException>;
    var RuntimeException: Newable<RuntimeException>;
    var UnderflowException: Newable<UnderflowException>;
    var UnexpectedValueException: Newable<UnexpectedValueException>;

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
