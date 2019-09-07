const TraceableEventDispatcher = Jymfony.Component.EventDispatcher.Debug.TraceableEventDispatcher;
const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[EventDispatcher] TraceableEventDispatcher', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         * @private
         */
        this._prophet = new Prophet();
    });

    afterEach(() => {
        if ('failed' === this.ctx.currentTest.state) {
            return;
        }

        this._prophet.checkPredictions();
    });

    it('should add listener to the underlying dispatcher', () => {
        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher);

        const listener = () => {};
        tdispatcher.addListener('foo', listener);

        const listeners = Array.from(dispatcher.getListeners('foo'));
        expect(listeners).to.have.length(1);
        expect(listeners[0]).to.be.equal(listener);

        tdispatcher.removeListener('foo', listener);
        expect(Array.from(dispatcher.getListeners('foo'))).to.be.empty;
    });

    it('should log event dispatch', () => {
        const dispatcher = new EventDispatcher();
        const logger = this._prophet.prophesize(LoggerInterface);
        const tdispatcher = new TraceableEventDispatcher(dispatcher, logger.reveal());

        const listener = () => {};
        const listener2 = () => {};
        tdispatcher.addListener('foo', listener);
        tdispatcher.addListener('foo', listener2);

        logger
            .debug('Notified event "{event}" to listener "{listener}"', { event: 'foo', 'listener': 'Function' })
            .shouldBeCalledTimes(2);

        return tdispatcher.dispatch('foo');
    });

    it('should log event stopped propagation', () => {
        const dispatcher = new EventDispatcher();
        const logger = this._prophet.prophesize(LoggerInterface);
        const tdispatcher = new TraceableEventDispatcher(dispatcher, logger.reveal());

        const listener = (event) => {
            event.stopPropagation();
        };
        const listener2 = () => {};
        tdispatcher.addListener('foo', listener);
        tdispatcher.addListener('foo', listener2);

        logger.debug('Notified event "{event}" to listener "{listener}"', { event: 'foo', 'listener': 'Function' }).shouldBeCalledTimes(1);
        logger.debug('Listener "{listener}" stopped propagation of event "{event}"', { event: 'foo', 'listener': 'Function' }).shouldBeCalledTimes(1);
        logger.debug('Listener "{listener}" was not called for event "{event}"', { event: 'foo', 'listener': 'Function' }).shouldBeCalledTimes(1);

        return tdispatcher.dispatch('foo');
    });

    it('dispatch should call listeners with priority', () => {
        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher);

        const called = [];
        const listener = () => {
            called.push('foo1');
        };
        const listener2 = () => {
            called.push('foo2');
        };
        tdispatcher.addListener('foo', listener, 10);
        tdispatcher.addListener('foo', listener2, 20);

        return tdispatcher.dispatch('foo')
            .then(() => {
                expect(called).to.be.deep.equal([ 'foo2', 'foo1' ]);
            });
    });
});
