const Debug = Jymfony.Component.Debug.Debug;
const expect = require('chai').expect;

describe('[Debug] Debug', function () {
    it('enable should set autoloader debug flag', () => {
        __jymfony.autoload.debug = false;
        expect(__jymfony.autoload.debug).to.be.false;

        const listeners = process.listeners('unhandledRejection');
        Debug.enable();
        process.removeAllListeners('unhandledRejection');

        for (const l of listeners) {
            process.on('unhandledRejection', l);
        }

        expect(__jymfony.autoload.debug).to.be.true;
    });

    it('enable should register unhandled rejection handler', () => {
        const listeners = process.listeners('unhandledRejection');
        Debug.enable();
        const listenersAfter = process.listeners('unhandledRejection');

        expect(listenersAfter.length).to.be.equal(listeners.length + 1);

        const listener = listenersAfter.pop();
        expect(listener.bind(null, new Error('test'), Promise.resolve()))
            .to.throw(Jymfony.Component.Debug.Exception.UnhandledRejectionException);

        process.removeAllListeners('unhandledRejection');

        for (const l of listeners) {
            process.on('unhandledRejection', l);
        }
    });
});
