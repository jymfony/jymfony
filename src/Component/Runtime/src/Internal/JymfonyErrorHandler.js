/**
 * @memberof Jymfony.Component.Runtime.Internal
 *
 * @internal
 */
export default class JymfonyErrorHandler {
    static register(debug) {
        if (ReflectionClass.exists('Jymfony.Component.Debug.ErrorHandler')) {
            const BufferingLogger = Jymfony.Component.Debug.BufferingLogger;
            const ErrorHandler = Jymfony.Component.Debug.ErrorHandler;
            ErrorHandler.register(new ErrorHandler(new BufferingLogger(), debug));
        }
    }
}
