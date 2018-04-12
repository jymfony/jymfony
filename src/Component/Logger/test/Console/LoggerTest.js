const Logger = Jymfony.Component.Logger.Logger;
const NullHandler = Jymfony.Component.Logger.Handler.NullHandler;
const expect = require('chai').expect;

describe('[Logger] Logger', function () {
    it('name should be set correctly', () => {
        const logger = new Logger('logger_test');
        expect(logger.name).to.be.equal('logger_test');
    });

    it('withName should return a new instance', () => {
        const logger = new Logger('first', [ new NullHandler() ]);
        const second = logger.withName('second');

        expect(logger.name).to.be.equal('first');
        expect(second.name).to.be.equal('second');
        expect(second.handlers).to.have.length(1);
    });
});
