const TraceableEventDispatcher = Jymfony.Component.EventDispatcher.Debug.TraceableEventDispatcher;
const Event = Jymfony.Contracts.EventDispatcher.Event;
const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
const LoggerInterface = Jymfony.Contracts.Logger.LoggerInterface;
const Stopwatch = Jymfony.Component.Stopwatch.Stopwatch;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class TraceableEventDispatcherTest extends TestCase {
    get testCaseName() {
        return '[EventDispatcher] ' + super.testCaseName;
    }

    get defaultTimeout() {
        return Infinity;
    }

    testAddRemoveListener() {
        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher, new Stopwatch());

        const listener = function () {};
        tdispatcher.addListener('foo', listener);

        const listeners = [ ...dispatcher.getListeners('foo') ];
        __self.assertCount(1, listeners);
        __self.assertSame(listener, listeners[0]);

        tdispatcher.removeListener('foo', listener);
        __self.assertCount(0, dispatcher.getListeners('foo'));
    }

    testGetListeners() {
        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher, new Stopwatch());

        const listener = function () {};
        tdispatcher.addListener('foo', listener);

        __self.assertEquals([ ...dispatcher.getListeners('foo') ], [ ...tdispatcher.getListeners('foo') ]);
    }

    testHasListeners() {
        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher, new Stopwatch());

        __self.assertFalse(dispatcher.hasListeners('foo'));
        __self.assertFalse(tdispatcher.hasListeners('foo'));

        const listener = function () {};
        tdispatcher.addListener('foo', listener);

        __self.assertTrue(dispatcher.hasListeners('foo'));
        __self.assertTrue(tdispatcher.hasListeners('foo'));
    }

    async testGetListenerPriority() {
        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher, new Stopwatch());

        tdispatcher.addListener('foo', function () {}, 123);

        let listeners = [ ...dispatcher.getListeners('foo') ];
        __self.assertSame(123, tdispatcher.getListenerPriority('foo', listeners[0]));

        // Verify that priority is preserved when listener is removed and re-added in preProcess() and postProcess().
        await tdispatcher.dispatch(new Event(), 'foo');
        listeners = [ ...dispatcher.getListeners('foo') ];
        __self.assertSame(123, tdispatcher.getListenerPriority('foo', listeners[0]));
    }

    async testGetListenerPriorityWhileDispatching() {
        const tdispatcher = new TraceableEventDispatcher(new EventDispatcher(), new Stopwatch());
        let priorityWhileDispatching = null;

        const listener = function () {
            priorityWhileDispatching = tdispatcher.getListenerPriority('bar', listener);
        };

        tdispatcher.addListener('bar', listener, 5);
        await tdispatcher.dispatch(new Event(), 'bar');
        __self.assertSame(5, priorityWhileDispatching);
    }

    testAddRemoveSubscriber() {
        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher, new Stopwatch());

        const subscriber = new EventSubscriber();

        tdispatcher.addSubscriber(subscriber);
        const listeners = [ ...dispatcher.getListeners('foo') ];

        __self.assertCount(1, dispatcher.getListeners('foo'));
        __self.assertEquals(getCallableFromArray([ subscriber, 'call' ]), listeners[0]);

        tdispatcher.removeSubscriber(subscriber);
        __self.assertCount(0, dispatcher.getListeners('foo'));
    }

    async testGetCalledListeners() {
        const tdispatcher = new TraceableEventDispatcher(new EventDispatcher(), new Stopwatch());
        tdispatcher.addListener('foo', function () {}, 5);

        let listeners = tdispatcher.getNotCalledListeners(null);
        __self.assertCount(0, tdispatcher.getCalledListeners(null));
        __self.assertEquals([ { event: 'foo', pretty: 'Function', priority: 5 } ], listeners);

        await tdispatcher.dispatch(new Event(), 'foo');

        listeners = tdispatcher.getCalledListeners();
        __self.assertEquals([ { event: 'foo', pretty: 'Function', priority: 5 } ], listeners);
        __self.assertEquals([], tdispatcher.getNotCalledListeners());
    }

    async testGetCalledListenersNested() {
        let tdispatcher = null;
        const dispatcher = new TraceableEventDispatcher(new EventDispatcher(), new Stopwatch());
        dispatcher.addListener('foo', async function (event, eventName, dispatcher) {
            tdispatcher = dispatcher;
            await dispatcher.dispatch(new Event(), 'bar');
        });
        dispatcher.addListener('bar', function () {});
        await dispatcher.dispatch(new Event(), 'foo');

        __self.assertSame(dispatcher, tdispatcher);
        __self.assertCount(2, dispatcher.getCalledListeners(null));
    }

    testItReturnsNoOrphanedEventsWhenCreated() {
        const tdispatcher = new TraceableEventDispatcher(new EventDispatcher(), new Stopwatch());
        const events = tdispatcher.getOrphanedEvents(null);
        __self.assertEmpty(events);
    }

    async testItReturnsOrphanedEventsAfterDispatch() {
        const tdispatcher = new TraceableEventDispatcher(new EventDispatcher(), new Stopwatch());
        await tdispatcher.dispatch(new Event(), 'foo');

        const events = tdispatcher.getOrphanedEvents(null);
        __self.assertCount(1, events);
        __self.assertEquals([ 'foo' ], events);
    }

    async testItDoesNotReturnHandledEvents() {
        const tdispatcher = new TraceableEventDispatcher(new EventDispatcher(), new Stopwatch());
        tdispatcher.addListener('foo', function () {});

        await tdispatcher.dispatch(new Event(), 'foo');

        const events = tdispatcher.getOrphanedEvents(null);
        __self.assertEmpty(events);
    }

    async testLogger() {
        const logger = this.prophesize(LoggerInterface);
        logger.debug('Notified event "{event}" to listener "{listener}".', { event: 'foo', listener: 'Function' }).shouldBeCalledTimes(2);

        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher, new Stopwatch(), logger.reveal());
        tdispatcher.addListener('foo', function () {});
        tdispatcher.addListener('foo', function () {});

        await tdispatcher.dispatch(new Event(), 'foo');
    }

    async testLoggerWithStoppedEvent() {
        const logger = this.prophesize(LoggerInterface);
        logger.debug('Notified event "{event}" to listener "{listener}".', { event: 'foo', listener: 'Function' }).shouldBeCalledTimes(1);
        logger.debug('Listener "{listener}" stopped propagation of the event "{event}".', { event: 'foo', listener: 'Function' }).shouldBeCalledTimes(1);
        logger.debug('Listener "{listener}" was not called for event "{event}".', { event: 'foo', listener: 'Function' }).shouldBeCalledTimes(1);

        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher, new Stopwatch(), logger.reveal());
        tdispatcher.addListener('foo', function (event) {
            event.stopPropagation();
        });
        tdispatcher.addListener('foo', function () {});

        await tdispatcher.dispatch(new Event(), 'foo');
    }

    async testDispatchCallListeners() {
        const called = [];

        const dispatcher = new EventDispatcher();
        const tdispatcher = new TraceableEventDispatcher(dispatcher, new Stopwatch());
        tdispatcher.addListener('foo', function () {
            called.push('foo1');
        }, 10);
        tdispatcher.addListener('foo', function () {
            called.push('foo2');
        }, 20);

        await tdispatcher.dispatch(new Event(), 'foo');

        __self.assertSame([ 'foo2', 'foo1' ], called);
    }

    async testDispatchNested() {
        const dispatcher = new TraceableEventDispatcher(new EventDispatcher(), new Stopwatch());
        let loop = 1;
        let dispatchedEvents = 0;
        dispatcher.addListener('foo', async function () {
            ++loop;
            if (2 == loop) {
                await dispatcher.dispatch(new Event(), 'foo');
            }
        });
        dispatcher.addListener('foo', function () {
            ++dispatchedEvents;
        });

        await dispatcher.dispatch(new Event(), 'foo');

        __self.assertSame(2, dispatchedEvents);
    }

    async testDispatchReusedEventNested() {
        let nestedCall = false;
        const dispatcher = new TraceableEventDispatcher(new EventDispatcher(), new Stopwatch());
        dispatcher.addListener('foo', async function (e) {
            await dispatcher.dispatch(new Event(), 'bar', e);
        });
        dispatcher.addListener('bar', function () {
            nestedCall = true;
        });

        __self.assertFalse(nestedCall);
        await dispatcher.dispatch(new Event(), 'foo');
        __self.assertTrue(nestedCall);
    }

    async testListenerCanRemoveItselfWhenExecuted() {
        const eventDispatcher = new TraceableEventDispatcher(new EventDispatcher(), new Stopwatch());
        const listener1 = function (event, eventName, dispatcher) {
            dispatcher.removeListener('foo', listener1);
        };

        eventDispatcher.addListener('foo', listener1);
        eventDispatcher.addListener('foo', function () {});
        await eventDispatcher.dispatch(new Event(), 'foo');

        __self.assertCount(1, eventDispatcher.getListeners('foo'), 'expected listener1 to be removed');
    }
}

class EventSubscriber extends implementationOf(EventSubscriberInterface) {
    call() {
    }

    static getSubscribedEvents() {
        return { foo: 'call' };
    }
}
