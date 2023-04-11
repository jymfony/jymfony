const Argument = Jymfony.Component.Testing.Argument.Argument;
const ErrorHandler = Jymfony.Component.Debug.ErrorHandler;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class DeprecationTriggerTest extends TestCase {
    async testShouldEmitWarning() {
        const warningListeners = process.listeners('warning');
        let handler, prevLogger;
        for (const listener of warningListeners) {
            if (!! listener.innerObject && (handler = listener.innerObject.getObject()) instanceof ErrorHandler) {
                prevLogger = handler.setDefaultLogger(new NullLogger());
            }
        }

        const deprecationHandler = this.prophesize(ErrorHandler);
        deprecationHandler.handleError(Argument.that(e => !! e && 'FOOBAR is deprecated' === e.message)).shouldBeCalled();
        const callable = getCallableFromArray([ deprecationHandler.reveal(), 'handleError' ]);

        process.on('warning', callable);

        try {
            __jymfony.trigger_deprecated('FOOBAR is deprecated');
        } finally {
            if (prevLogger) {
                handler.setDefaultLogger(prevLogger);
            }

            process.off('warning', callable);
        }
    }
}
