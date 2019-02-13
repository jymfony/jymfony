declare namespace Jymfony.Component.Console.Helper {
    /**
     * Helps outputting debug information when running an external program from a command.
     * An external program can be a Process, an HTTP request, or anything else.
     */
    export class DebugFormatterHelper extends Helper {
        private _colors: string[];
        private _started: Record<string, any>;
        private _count: number;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Starts a debug formatting session.
         *
         * @param id The id of the formatting session
         * @param message The message to display
         * @param [prefix = 'RUN'] The prefix to use
         */
        start(id: string, message: string, prefix?: string): string

        /**
         * Adds progress to a formatting session.
         *
         * @param id The id of the formatting session
         * @param buffer The message to display
         * @param [error = false] Whether to consider the buffer as error
         * @param [prefix = 'OUT'] The prefix for output
         * @param [errorPrefix = 'ERR'] The prefix for error output
         */
        progress(id: string, buffer: string, error?: boolean, prefix?: string, errorPrefix?: string): string;

        /**
         * Stops a formatting session.
         *
         * @param id The id of the formatting session
         * @param message The message to display
         * @param successful Whether to consider the result as success
         * @param [prefix = 'RES'] The prefix for the end output
         */
        stop(id: string, message: string, successful: boolean, prefix?: string): string;

        /**
         * @param id The id of the formatting session
         */
        private _getBorder(id: string): string;
    }
}
