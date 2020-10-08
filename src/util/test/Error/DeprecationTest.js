require('../../lib/Error/trigger_deprecated');

const ErrorHandler = Jymfony.Component.Debug.ErrorHandler;
const NullLogger = Jymfony.Contracts.Logger.NullLogger;
const { expect } = require('chai');

describe('Deprecation Trigger', function () {
    it('emits warning', function(done) {
        const warningListeners = process.listeners('warning');
        let handler, prevLogger;
        for (const listener of warningListeners) {
            if (!! listener.innerObject && (handler = listener.innerObject.getObject()) instanceof ErrorHandler) {
                prevLogger = handler.setDefaultLogger(new NullLogger());
            }
        }

        process.once('warning', warning => {
            expect(warning.message).to.be.equal('FOOBAR is deprecated');
            expect(warning.name).to.be.equal('DeprecationWarning');

            if (prevLogger) {
                handler.setDefaultLogger(prevLogger);
            }

            done();
        });

        __jymfony.trigger_deprecated('FOOBAR is deprecated');
    });
});
