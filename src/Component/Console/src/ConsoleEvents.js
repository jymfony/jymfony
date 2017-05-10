/**
 * Contains all events dispatched by an Application.
 *
 * @memberOf Jymfony.Component.Console
 * @final
 */
class ConsoleEvents {
}

/**
 * The COMMAND event allows you to attach listeners before any command is
 * executed by the console. It also allows you to modify the command, input and output
 * before they are handled to the command.
 *
 * @type {string}
 */
ConsoleEvents.COMMAND = 'console.command';

/**
 * The TERMINATE event allows you to attach listeners after a command is
 * executed by the console.
 *
 * @type {string}
 */
ConsoleEvents.TERMINATE = 'console.terminate';

/**
 * The ERROR event occurs when an uncaught exception or error appears.
 *
 * This event allows you to deal with the exception/error or
 * to modify the thrown exception.
 *
 * @type {string}
 */
ConsoleEvents.ERROR = 'console.error';

module.exports = ConsoleEvents;
