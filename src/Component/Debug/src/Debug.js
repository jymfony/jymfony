const BufferingLogger = Jymfony.Component.Debug.BufferingLogger;
const ErrorHandler = Jymfony.Component.Debug.ErrorHandler;
const Timeout = Jymfony.Component.Debug.Timeout;
const UnhandledRejectionException = Jymfony.Component.Debug.Exception.UnhandledRejectionException;

/**
 * @memberOf Jymfony.Component.Debug
 */
export default class Debug {
    static enable() {
        __jymfony.autoload.debug = true;

        process.on('unhandledRejection', (reason, p) => {
            throw new UnhandledRejectionException(p, reason instanceof Error ? reason : undefined);
        });

        __jymfony.ManagedProxy.enableDebug();
        Timeout.enable();
        ErrorHandler.register(new ErrorHandler(new BufferingLogger(), true));
    }
}
