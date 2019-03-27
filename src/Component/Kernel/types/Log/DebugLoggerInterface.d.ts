declare namespace Jymfony.Component.Kernel.Log {
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
        public readonly logs: Log[];

        /**
         * Returns the number of errors.
         *
         * @returns The number of errors
         */
        public readonly countErrors: number;

        /**
         * Removes all log records.
         */
        clear(): void;
    }
}
