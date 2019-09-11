/**
 * @memberOf Jymfony.Component.Logger
 */
export default class LogLevel { }

/**
 * System is unusable.
 *
 * @type {int}
 */
LogLevel.EMERGENCY = 600;

/**
 * Action must be taken immediately.
 *
 * @type {int}
 */
LogLevel.ALERT = 550;

/**
 * Critical conditions.
 *
 * @type {int}
 */
LogLevel.CRITICAL = 500;

/**
 * Runtime errors that do not require immediate action but should typically
 * be logged and monitored.
 *
 * @type {int}
 */
LogLevel.ERROR = 400;

/**
 * Exceptional occurrences that are not errors.
 *
 * Example: Use of deprecated APIs, poor use of an API, undesirable things
 * that are not necessarily wrong.
 *
 * @type {int}
 */
LogLevel.WARNING = 300;

/**
 * Normal but significant events.
 *
 * @type {int}
 */
LogLevel.NOTICE = 250;

/**
 * Interesting events.
 *
 * @type {int}
 */
LogLevel.INFO = 200;

/**
 * Detailed debug information.
 *
 * @type {int}
 */
LogLevel.DEBUG = 100;
