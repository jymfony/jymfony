const expect = require('chai').expect;

const EventDispatcher = Jymfony.Component.EventDispatcher.EventDispatcher;
const Event = Jymfony.Component.EventDispatcher.Event;

const createEventDispatcher = function() {
    return new EventDispatcher();
};

const preFoo = 'event.pre_foo';
const postFoo = 'event.post_foo';

class TestEventListener {
    constructor() {
        this.preFooCalled = false;
        this.postFooCalled = false;
    }

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

describe('[EventDispatcher] EventDispatcher', function () {
    it('construct', function () {
        const dispatcher = createEventDispatcher();

        return (
            expect(Array.from(dispatcher.getListeners())).to.be.deep.equal([]) &&
            expect(dispatcher.hasListeners(preFoo)).to.be.false &&
            expect(dispatcher.hasListeners(postFoo)).to.be.false
        );
    });

    it('addListeners', function () {
        const dispatcher = createEventDispatcher();
        const listener = new TestEventListener();

        dispatcher.addListener(preFoo, [ listener, 'preFoo' ]);
        dispatcher.addListener(postFoo, [ listener, 'postFoo' ]);

        return (
            expect(dispatcher.hasListeners(preFoo)).to.be.true &&
            expect(dispatcher.hasListeners(postFoo)).to.be.true &&
            expect(Array.from(dispatcher.getListeners(preFoo))).to.have.lengthOf(1) &&
            expect(Array.from(dispatcher.getListeners(postFoo))).to.have.lengthOf(1) &&
            expect(Array.from(dispatcher.getListeners())).to.have.lengthOf(2)
        );
    });

    it('getListenersSortsByPriority', function () {
        const dispatcher = createEventDispatcher();

        const listener1 = new TestEventListener();
        const listener2 = new TestEventListener();
        const listener3 = new TestEventListener();

        listener1.name = '1';
        listener2.name = '2';
        listener3.name = '3';

        dispatcher.addListener(preFoo, listener1.foo1, -10);
        dispatcher.addListener(preFoo, listener2.foo2, 10);
        dispatcher.addListener(preFoo, listener3.foo3, 0);

        const listeners = Array.from(dispatcher.getListeners(preFoo));

        return (
            expect(listeners[0]).to.be.equal(listener1.foo2) &&
            expect(listeners[1]).to.be.equal(listener1.foo3) &&
            expect(listeners[2]).to.be.equal(listener1.foo1)
        );
    });

    it('dispatch', function () {
        const dispatcher = createEventDispatcher();
        const listener = new TestEventListener();

        dispatcher.addListener(preFoo, [ listener, 'preFoo' ]);
        dispatcher.addListener(postFoo, [ listener, 'postFoo' ]);

        const promise = dispatcher.dispatch('event.pre_foo');
        expect(promise).to.be.instanceOf(Promise);

        promise.then(() => {
            return expect(listener.preFooCalled).to.be.true &&
                expect(listener.postFooCalled).to.be.false;
        });

        const event = new Event();
        return promise.then(() => {
            Promise.all([
                dispatcher.dispatch('noevent').then(event => expect(event).to.be.instanceOf(Event)),
                dispatcher.dispatch(preFoo).then(event => expect(event).to.be.instanceOf(Event)),
                dispatcher.dispatch(postFoo, event).then(e => expect(e === event).to.be.true),
            ]);
        });
    });

    it('dispatch for closure', function () {
        const dispatcher = createEventDispatcher();
        let invoked = 0;
        const listener = () => {
            invoked++;
        };

        dispatcher.addListener(preFoo, listener);
        dispatcher.addListener(postFoo, listener);
        return dispatcher.dispatch(preFoo)
            .then(() => {
                return expect(invoked).to.be.equal(1);
            });
    });

    it('stop event propagation', function () {
        const dispatcher = createEventDispatcher();
        const listener = new TestEventListener();

        dispatcher.addListener('event.post_foo', [ listener, 'postFoo' ], 10);
        dispatcher.addListener('event.post_foo', [ listener, 'preFoo' ]);
        return dispatcher.dispatch(postFoo)
            .then(() => {
                return expect(listener.postFooCalled).to.be.true &&
                expect(listener.preFooCalled).to.be.false;
            });
    });

    it('dispatch by priority', function () {
        const dispatcher = createEventDispatcher();

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

        dispatcher.addListener(preFoo, listener1, -10);
        dispatcher.addListener(preFoo, listener2);
        dispatcher.addListener(preFoo, listener3, 10);
        return dispatcher.dispatch(preFoo)
            .then(() => {
                return expect(invoked).to.deep.equal([ '3', '2', '1' ]);
            });
    });

    it('remove listener', function () {
        const dispatcher = createEventDispatcher();
        const listener = new TestEventListener();

        dispatcher.addListener('pre.bar', [ listener, 'foo1' ]);
        const test1 = expect(dispatcher.hasListeners('pre.bar')).to.be.true;

        dispatcher.removeListener('pre.bar', [ listener, 'foo1' ]);
        const test2 = expect(dispatcher.hasListeners('pre.bar')).to.be.false;

        dispatcher.removeListener('non_exists', [ listener, 'foo1' ]);
        return test1 && test2;
    });

    it('add subscriber', function () {
        const dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(new TestEventSubscriber());

        return expect(dispatcher.hasListeners('preFoo')).to.be.true &&
                expect(dispatcher.hasListeners('postFoo')).to.be.true;
    });

    it('add subscriber with priorities', function () {
        const dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(new TestEventSubscriber());
        dispatcher.addSubscriber(new TestEventSubscriberWithPriorities());

        const listeners = Array.from(dispatcher.getListeners('preFoo'));
        return expect(dispatcher.hasListeners('preFoo')).to.be.true &&
                expect(listeners).to.have.lengthOf(2) &&
                expect(listeners[0].innerObject.getObject()).to.be.instanceOf(TestEventSubscriberWithPriorities);
    });

    it('add subscriber with multiple listeners', function () {
        const subscriber = new TestEventSubscriberWithMultipleListeners();
        const dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(subscriber);

        const listeners = Array.from(dispatcher.getListeners('preFoo'));
        return expect(dispatcher.hasListeners('preFoo')).to.be.true &&
                expect(listeners).to.have.lengthOf(2) &&
                expect(listeners[1].innerObject.equals([ subscriber, 'foo1' ])).to.be.true;
    });

    it('remove subscriber', function () {
        const subscriber = new TestEventSubscriber();
        const dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(subscriber);

        const ret = expect(dispatcher.hasListeners('preFoo')).to.be.true &&
            expect(dispatcher.hasListeners('postFoo')).to.be.true;

        dispatcher.removeSubscriber(subscriber);
        return ret && expect(dispatcher.hasListeners('preFoo')).to.be.false &&
            expect(dispatcher.hasListeners('postFoo')).to.be.false;
    });

    it('remove subscriber with priorities', function () {
        const subscriber = new TestEventSubscriberWithPriorities();
        const dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(subscriber);

        const ret = expect(dispatcher.hasListeners('preFoo')).to.be.true;

        dispatcher.removeSubscriber(subscriber);
        return ret && expect(dispatcher.hasListeners('preFoo')).to.be.false;
    });

    it('add subscriber with multiple listeners', function () {
        const subscriber = new TestEventSubscriberWithMultipleListeners();
        const dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(subscriber);

        const ret = expect(dispatcher.hasListeners('preFoo')).to.be.true &&
                    expect(Array.from(dispatcher.getListeners('preFoo'))).to.have.lengthOf(2);

        dispatcher.removeSubscriber(subscriber);
        return ret && expect(dispatcher.hasListeners('preFoo')).to.be.false;
    });

    it('receives correct arguments', function () {
        let name, instance;
        const dispatcher = createEventDispatcher();

        dispatcher.addListener('preFoo', (e, n, i) => {
            name = n;
            instance = i;
        });

        return dispatcher.dispatch('preFoo')
            .then(() => {
                return expect(name).to.be.equal('preFoo') &&
                expect(instance).to.be.equal(dispatcher);
            });
    });

    it('getListenerPriority should work', () => {
        const dispatcher = createEventDispatcher();
        const listener1 = new TestEventListener();
        const listener2 = new TestEventListener();

        dispatcher.addListener('pre.foo', listener1, -10);
        dispatcher.addListener('pre.foo', listener2);

        expect(dispatcher.getListenerPriority('pre.foo', listener1)).to.be.equal(-10);
        expect(dispatcher.getListenerPriority('pre.foo', listener2)).to.be.equal(0);
        expect(dispatcher.getListenerPriority('pre.bar', listener2)).to.be.undefined;
        expect(dispatcher.getListenerPriority('pre.foo', () => {})).to.be.undefined;
    });

    it('getListenerPriority should find lazy listeners', () => {
        const dispatcher = createEventDispatcher();
        const listener = new TestEventListener();

        dispatcher.addListener('pre.foo', [ () => listener, 'preFoo' ], -10);
        expect(dispatcher.getListenerPriority('pre.foo', [ listener, 'preFoo' ])).to.be.equal(-10);
    });
});
