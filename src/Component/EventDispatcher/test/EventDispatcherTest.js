const { expect } = require('chai');

const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const Event = Jymfony.Contracts.EventDispatcher.Event;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const preFoo = 'event.pre_foo';
const postFoo = 'event.post_foo';

class TestEventListener {
    name;
    preFooCalled = false;
    postFooCalled = false;

    foo1 () { }
    foo2 () { }
    foo3 () { }

    preFoo() {
        this.preFooCalled = true;
    }

    postFoo(event) {
        this.postFooCalled = true;
        event.stopPropagation();
    }
}

class TestEventSubscriber extends TestEventListener {
    static getSubscribedEvents() {
        return {
            preFoo: 'preFoo',
            postFoo: 'postFoo',
        };
    }
}

class TestEventSubscriberWithPriorities extends TestEventListener {
    getSubscribedEvents() {
        return {
            preFoo: [ 'preFoo', 10 ],
            postFoo: [ 'postFoo' ],
        };
    }
}

class TestEventSubscriberWithMultipleListeners extends TestEventListener {
    static getSubscribedEvents() {
        return {
            preFoo: [
                [ 'preFoo', 10 ],
                [ 'foo1' ],
            ],
        };
    }
}

export default class EventDispatcherTest extends TestCase {
    /**
     * @type {Jymfony.Component.EventDispatcher.EventDispatcher}
     * @private
     */
    _dispatcher;

    beforeEach() {
        this._dispatcher = new EventDispatcher();
    }

    get testCaseName() {
        return '[EventDispatcher] ' + super.testCaseName;
    }

    testConstruct() {
        __self.assertEquals([], [ ...this._dispatcher.getListeners() ]);
        __self.assertFalse(this._dispatcher.hasListeners(preFoo));
        __self.assertFalse(this._dispatcher.hasListeners(postFoo));
    }

    testAddListeners() {
        const listener = new TestEventListener();

        this._dispatcher.addListener(preFoo, [ listener, 'preFoo' ]);
        this._dispatcher.addListener(postFoo, [ listener, 'postFoo' ]);

        __self.assertTrue(this._dispatcher.hasListeners(preFoo));
        __self.assertTrue(this._dispatcher.hasListeners(postFoo));
        __self.assertEquals(1, [ ...this._dispatcher.getListeners(preFoo) ].length);
        __self.assertEquals(1, [ ...this._dispatcher.getListeners(postFoo) ].length);
        __self.assertEquals(2, [ ...this._dispatcher.getListeners() ].length);
    }

    testGetListenersSortsByPriority() {
        const listener1 = new TestEventListener();
        const listener2 = new TestEventListener();
        const listener3 = new TestEventListener();

        listener1.name = '1';
        listener2.name = '2';
        listener3.name = '3';

        this._dispatcher.addListener(preFoo, listener1.foo1, -10);
        this._dispatcher.addListener(preFoo, listener2.foo2, 10);
        this._dispatcher.addListener(preFoo, listener3.foo3, 0);

        const listeners = [ ...this._dispatcher.getListeners(preFoo) ];

        __self.assertEquals(listener2.foo2, listeners[0]);
        __self.assertEquals(listener3.foo3, listeners[1]);
        __self.assertEquals(listener1.foo1, listeners[2]);
    }

    async testDispatch() {
        const listener = new TestEventListener();

        this._dispatcher.addListener(preFoo, [ listener, 'preFoo' ]);
        this._dispatcher.addListener(postFoo, [ listener, 'postFoo' ]);

        const promise = this._dispatcher.dispatch(new Event(), 'event.pre_foo');
        expect(promise).to.be.instanceOf(Promise);

        await promise;
        __self.assertTrue(listener.preFooCalled);
        __self.assertFalse(listener.postFooCalled);

        __self.assertInstanceOf(Event, await this._dispatcher.dispatch(new Event(), 'noevent'));
        __self.assertInstanceOf(Event, await this._dispatcher.dispatch(new Event(), preFoo));

        const event = new Event();
        __self.assertSame(event, await this._dispatcher.dispatch(event, postFoo));
    }

    async testDispatchForClosure() {
        let invoked = 0;
        const listener = () => {
            invoked++;
        };

        this._dispatcher.addListener(preFoo, listener);
        this._dispatcher.addListener(postFoo, listener);
        await this._dispatcher.dispatch(new Event(), preFoo);

        __self.assertEquals(1, invoked);
    }

    async testStopEventPropagation() {
        const listener = new TestEventListener();

        this._dispatcher.addListener('event.post_foo', [ listener, 'postFoo' ], 10);
        this._dispatcher.addListener('event.post_foo', [ listener, 'preFoo' ]);
        await this._dispatcher.dispatch(new Event(), postFoo);

        __self.assertTrue(listener.postFooCalled);
        __self.assertFalse(listener.preFooCalled);
    }

    async testDispatchByPriority() {
        const invoked = [];
        const listener1 = () => {
            invoked.push('1');
        };
        const listener2 = () => {
            invoked.push('2');
        };
        const listener3 = () => {
            invoked.push('3');
        };

        this._dispatcher.addListener(preFoo, listener1, -10);
        this._dispatcher.addListener(preFoo, listener2);
        this._dispatcher.addListener(preFoo, listener3, 10);
        await this._dispatcher.dispatch(new Event(), preFoo);
        __self.assertEquals([ '3', '2', '1' ], invoked);
    }

    testRemoveListener() {
        const listener = new TestEventListener();

        this._dispatcher.addListener('pre.bar', [ listener, 'foo1' ]);
        __self.assertTrue(this._dispatcher.hasListeners('pre.bar'));

        this._dispatcher.removeListener('pre.bar', [ listener, 'foo1' ]);
        __self.assertFalse(this._dispatcher.hasListeners('pre.bar'));

        this._dispatcher.removeListener('non_exists', [ listener, 'foo1' ]);
    }

    testAddSubscriber() {
        this._dispatcher.addSubscriber(new TestEventSubscriber());

        __self.assertTrue(this._dispatcher.hasListeners('preFoo'));
        __self.assertTrue(this._dispatcher.hasListeners('postFoo'));
    }

    testAddSubscriberWithPriorities() {
        this._dispatcher.addSubscriber(new TestEventSubscriber());
        this._dispatcher.addSubscriber(new TestEventSubscriberWithPriorities());

        const listeners = [ ...this._dispatcher.getListeners('preFoo') ];
        __self.assertTrue(this._dispatcher.hasListeners('preFoo'));
        __self.assertEquals(2, listeners.length);
        __self.assertInstanceOf(TestEventSubscriberWithPriorities, listeners[0].innerObject.getObject());
    }

    testAddSubscriberWithMultipleListeners() {
        const subscriber = new TestEventSubscriberWithMultipleListeners();
        this._dispatcher.addSubscriber(subscriber);

        const listeners = [ ...this._dispatcher.getListeners('preFoo') ];
        __self.assertTrue(this._dispatcher.hasListeners('preFoo'));
        __self.assertEquals(2, listeners.length);
        __self.assertTrue(listeners[1].innerObject.equals([ subscriber, 'foo1' ]));
    }

    testRemoveSubscriber() {
        const subscriber = new TestEventSubscriber();
        this._dispatcher.addSubscriber(subscriber);

        __self.assertTrue(this._dispatcher.hasListeners('preFoo'));
        __self.assertTrue(this._dispatcher.hasListeners('postFoo'));

        this._dispatcher.removeSubscriber(subscriber);

        __self.assertFalse(this._dispatcher.hasListeners('preFoo'));
        __self.assertFalse(this._dispatcher.hasListeners('postFoo'));
    }

    testRemoveSubscriberWithPriorities() {
        const subscriber = new TestEventSubscriberWithPriorities();
        this._dispatcher.addSubscriber(subscriber);

        __self.assertTrue(this._dispatcher.hasListeners('preFoo'));

        this._dispatcher.removeSubscriber(subscriber);
        __self.assertFalse(this._dispatcher.hasListeners('preFoo'));
    }

    testAddSubscriberWithMultipleListeners2() {
        const subscriber = new TestEventSubscriberWithMultipleListeners();
        this._dispatcher.addSubscriber(subscriber);

        __self.assertTrue(this._dispatcher.hasListeners('preFoo'));
        __self.assertEquals(2, [ ...this._dispatcher.getListeners('preFoo') ].length);

        this._dispatcher.removeSubscriber(subscriber);
        __self.assertFalse(this._dispatcher.hasListeners('preFoo'));
    }

    async testReceivesCorrectArguments() {
        let name, instance;
        this._dispatcher.addListener('preFoo', (e, n, i) => {
            name = n;
            instance = i;
        });

        await this._dispatcher.dispatch(new Event(), 'preFoo');
        __self.assertEquals('preFoo', name);
        __self.assertEquals(this._dispatcher, instance);
    }

    testGetListenerPriorityShouldWork() {
        const listener1 = new TestEventListener();
        const listener2 = new TestEventListener();

        this._dispatcher.addListener('pre.foo', listener1, -10);
        this._dispatcher.addListener('pre.foo', listener2);

        __self.assertEquals(-10, this._dispatcher.getListenerPriority('pre.foo', listener1));
        __self.assertEquals(0, this._dispatcher.getListenerPriority('pre.foo', listener2));
        __self.assertUndefined(this._dispatcher.getListenerPriority('pre.bar', listener2));
        __self.assertUndefined(this._dispatcher.getListenerPriority('pre.foo', () => {}));
    }

    testGetListenerPriorityShouldFindLazyListeners() {
        const listener = new TestEventListener();

        this._dispatcher.addListener('pre.foo', [ () => listener, 'preFoo' ], -10);
        __self.assertEquals(-10, this._dispatcher.getListenerPriority('pre.foo', [ listener, 'preFoo' ]));
    }
}
