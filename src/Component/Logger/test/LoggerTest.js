const Logger = Jymfony.Component.Logger.Logger;
const HandlerInterface = Jymfony.Component.Logger.Handler.HandlerInterface;
const NullHandler = Jymfony.Component.Logger.Handler.NullHandler;
const TestHandler = Jymfony.Component.Logger.Handler.TestHandler;
const MessageProcessor = Jymfony.Component.Logger.Processor.MessageProcessor;
const Prophet = Jymfony.Component.Testing.Prophet;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const expect = require('chai').expect;

describe('[Logger] Logger', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         * @private
         */
        this._prophet = new Prophet();
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

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

    it('channel should be set correctly', () => {
        const handler = new TestHandler();
        const logger = new Logger('foo', [ handler ]);

        logger.addWarning('test');
        const [ record ] = handler.records;

        expect(record.channel).to.be.equal('foo');
    });

    it('handle should be called', () => {
        const handler = this._prophet.prophesize(HandlerInterface);
        handler.isHandling(Argument.any()).willReturn(true);
        handler.handle(Argument.any()).shouldBeCalledTimes(1);

        const logger = new Logger('foo', [ handler.reveal() ]);

        logger.addWarning('test');
    });

    it('handle should not be called if isHandling returns false', () => {
        const handler = this._prophet.prophesize(HandlerInterface);
        handler.isHandling(Argument.any()).willReturn(false);
        handler.handle(Argument.any()).shouldNotBeCalled();

        const logger = new Logger('foo', [ handler.reveal() ]);

        logger.addWarning('test');
    });

    it('popHandler should work', () => {
        const handler1 = new TestHandler();
        const handler2 = new TestHandler();

        const logger = new Logger('foo');
        logger.pushHandler(handler1);
        logger.pushHandler(handler2);

        expect(logger.popHandler()).to.be.equal(handler2);
        expect(logger.popHandler()).to.be.equal(handler1);

        expect(logger.popHandler.bind(logger)).to.throw(LogicException);
    });

    it('set handlers should work and drop object keys', () => {
        const handler1 = new TestHandler();
        const handler2 = new TestHandler();

        const logger = new Logger('foo');
        logger.pushHandler(handler1);
        logger.handlers = [ handler2 ];

        expect(logger.handlers).to.be.deep.equal([ handler2 ]);

        logger.handlers = {
            key: handler1,
            AnotherKey: handler2,
        };

        expect(logger.handlers).to.be.deep.equal([ handler1, handler2 ]);
    });

    it('push/pop processor', () => {
        const processor1 = new MessageProcessor();
        const processor2 = new MessageProcessor();

        const logger = new Logger('foo');
        logger.pushProcessor(processor1);
        logger.pushProcessor(processor2);

        expect(logger.popProcessor()).to.be.equal(processor2);
        expect(logger.popProcessor()).to.be.equal(processor1);
        expect(logger.popProcessor.bind(logger)).to.throw(LogicException);
    });
});
