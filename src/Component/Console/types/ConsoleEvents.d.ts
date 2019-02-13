declare namespace Jymfony.Component.Console {
    /**
     * Contains all events dispatched by an Application.
     *
     * @final
     */
    export class ConsoleEvents {
        /**
         * The COMMAND event allows you to attach listeners before any command is
         * executed by the console. It also allows you to modify the command, input and output
         * before they are handled to the command.
         */
        public static readonly COMMAND = 'console.command';

        /**
         * The TERMINATE event allows you to attach listeners after a command is
         * executed by the console.
         */
        public static readonly TERMINATE = 'console.terminate';

        /**
         * The ERROR event occurs when an uncaught exception or error appears.
         *
         * This event allows you to deal with the exception/error or
         * to modify the thrown exception.
         */
        public static readonly ERROR = 'console.error';
    }
}
