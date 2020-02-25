/**
 * @memberOf Jymfony.Component.HttpServer.Exception
 */
export default class UnhandledRejectionException extends Exception {
    __construct(previous) {
        super.__construct('Unhandled promise rejection: ' + previous.message, previous.code || null, previous);
    }
}
