declare namespace Jymfony.Component.Kernel.Log {
    import Command = Jymfony.Component.Console.Command.Command;
    import Request = Jymfony.Component.HttpFoundation.Request;

    interface Log {
        timestamp: number;
        message: string;
        priority: number;
        priorityName: string;
    }

    export class DebugLoggerInterface implements MixinInterface {
        public static readonly definition: Newable<DebugLoggerInterface>;

        /**
         * Returns an array of logs.
         *
         * A log is an array with the following mandatory keys:
         * timestamp, message, priority, and priorityName.
         * It can also have an optional context key containing an array.
         *
         * @returns An array of logs
         */
        getLogs(subject: Command | Request): Log[];

        /**
         * Returns the number of errors.
         *
         * @returns The number of errors
         */
        countErrors(subject: Command | Request): number;

        /**
         * Removes all log records (optionally filtered).
         */
        clear(subject?: Command | Request): void;
    }
}
