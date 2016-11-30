let expect = require('chai').expect;

const EventDispatcher = Jymfony.EventDispatcher.EventDispatcher;
const Event = Jymfony.EventDispatcher.Event;

let createEventDispatcher = function() {
    return new EventDispatcher();
};

const preFoo = 'event.pre_foo';
const postFoo = 'event.post_foo';

class TestEventListener
{
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
            postFoo: 'postFoo'
        };
    }
}

class TestEventSubscriberWithPriorities extends TestEventListener {
    getSubscribedEvents() {
        return {
            preFoo: ['preFoo', 10],
            postFoo: ['postFoo']
        };
    }
}

class TestEventSubscriberWithMultipleListeners extends TestEventListener {
    static getSubscribedEvents() {
        return {
            preFoo: [
                ['preFoo', 10],
                ['foo1']
            ]
        };
    }
}

describe('EventDispatcher', function () {
    it('construct', function () {
        let dispatcher = createEventDispatcher();

        return (
            expect(Array.from(dispatcher.getListeners())).to.be.deep.equal([]) &&
            expect(dispatcher.hasListeners(preFoo)).to.be.false &&
            expect(dispatcher.hasListeners(postFoo)).to.be.false
        );
    });

    it('addListeners', function () {
        let dispatcher = createEventDispatcher();
        let listener = new TestEventListener();

        dispatcher.addListener(preFoo, [listener, 'preFoo']);
        dispatcher.addListener(postFoo, [listener, 'postFoo']);

        return (
            expect(dispatcher.hasListeners(preFoo)).to.be.true &&
            expect(dispatcher.hasListeners(postFoo)).to.be.true &&
            expect(Array.from(dispatcher.getListeners(preFoo))).to.have.lengthOf(1) &&
            expect(Array.from(dispatcher.getListeners(postFoo))).to.have.lengthOf(1) &&
            expect(Array.from(dispatcher.getListeners())).to.have.lengthOf(2)
        )
    });

    it('getListenersSortsByPriority', function () {
        let dispatcher = createEventDispatcher();

        let listener1 = new TestEventListener();
        let listener2 = new TestEventListener();
        let listener3 = new TestEventListener();

        listener1.name = '1';
        listener2.name = '2';
        listener3.name = '3';

        dispatcher.addListener(preFoo, listener1.foo1, -10);
        dispatcher.addListener(preFoo, listener2.foo2, 10);
        dispatcher.addListener(preFoo, listener3.foo3, 0);

        let listeners = Array.from(dispatcher.getListeners(preFoo));

        return (
            expect(listeners[0]).to.be.equal(listener1.foo2) &&
            expect(listeners[1]).to.be.equal(listener1.foo3) &&
            expect(listeners[2]).to.be.equal(listener1.foo1)
        );
    });

    it('dispatch', function () {
        let dispatcher = createEventDispatcher();
        let listener = new TestEventListener();

        dispatcher.addListener(preFoo, [listener, 'preFoo']);
        dispatcher.addListener(postFoo, [listener, 'postFoo']);

        dispatcher.dispatch('event.pre_foo');

        let event = new Event;
        return (
            expect(listener.preFooCalled).to.be.true &&
            expect(listener.postFooCalled).to.be.false &&
            expect(dispatcher.dispatch('noevent')).to.be.instanceOf(Event) &&
            expect(dispatcher.dispatch(preFoo)).to.be.instanceOf(Event) &&
            expect(dispatcher.dispatch(postFoo, event) === event).to.be.true
        );
    });

    it('dispatch for closure', function () {
        let dispatcher = createEventDispatcher();
        let invoked = 0;
        let listener = () => {
            invoked++;
        };

        dispatcher.addListener(preFoo, listener);
        dispatcher.addListener(postFoo, listener);
        dispatcher.dispatch(preFoo);

        return expect(invoked).to.be.equal(1);
    });

    it('stop event propagation', function () {
        let dispatcher = createEventDispatcher();
        let listener = new TestEventListener();

        dispatcher.addListener('event.post_foo', [listener, 'postFoo'], 10);
        dispatcher.addListener('event.post_foo', [listener, 'preFoo']);
        dispatcher.dispatch(postFoo);

        return (
            expect(listener.postFooCalled).to.be.true &&
            expect(listener.preFooCalled).to.be.false
        );
    });

    it('dispatch by priority', function () {
        let dispatcher = createEventDispatcher();

        let invoked = [];
        let listener1 = () => {
            invoked.push('1');
        };
        let listener2 = () => {
            invoked.push('2');
        };
        let listener3 = () => {
            invoked.push('3');
        };

        dispatcher.addListener(preFoo, listener1, -10);
        dispatcher.addListener(preFoo, listener2);
        dispatcher.addListener(preFoo, listener3, 10);
        dispatcher.dispatch(preFoo);

        return expect(invoked).to.deep.equal(['3', '2', '1']);
    });

    it('remove listener', function () {
        let dispatcher = createEventDispatcher();
        let listener = new TestEventListener();

        dispatcher.addListener('pre.bar', [listener, 'foo1']);
        let test1 = expect(dispatcher.hasListeners('pre.bar')).to.be.true;

        dispatcher.removeListener('pre.bar', [listener, 'foo1']);
        let test2 = expect(dispatcher.hasListeners('pre.bar')).to.be.false;

        dispatcher.removeListener('non_exists', [listener, 'foo1']);
        return test1 && test2;
    });

    it('add subscriber', function () {
        let dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(new TestEventSubscriber());

        return expect(dispatcher.hasListeners('preFoo')).to.be.true &&
                expect(dispatcher.hasListeners('postFoo')).to.be.true;
    });

    it('add subscriber with priorities', function () {
        let dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(new TestEventSubscriber());
        dispatcher.addSubscriber(new TestEventSubscriberWithPriorities());

        let listeners = Array.from(dispatcher.getListeners('preFoo'));
        return expect(dispatcher.hasListeners('preFoo')).to.be.true &&
                expect(listeners).to.have.lengthOf(2) &&
                expect(listeners[0].innerObject.getObject()).to.be.instanceOf(TestEventSubscriberWithPriorities);
    });

    it('add subscriber with multiple listeners', function () {
        let subscriber, dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(subscriber = new TestEventSubscriberWithMultipleListeners());

        let listeners = Array.from(dispatcher.getListeners('preFoo'));
        return expect(dispatcher.hasListeners('preFoo')).to.be.true &&
                expect(listeners).to.have.lengthOf(2) &&
                expect(listeners[1].innerObject.equals([subscriber, 'foo1'])).to.be.true;
    });

    it('remove subscriber', function () {
        let subscriber, dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(subscriber = new TestEventSubscriber());

        let ret = expect(dispatcher.hasListeners('preFoo')).to.be.true &&
            expect(dispatcher.hasListeners('postFoo')).to.be.true;

        dispatcher.removeSubscriber(subscriber);
        return ret && expect(dispatcher.hasListeners('preFoo')).to.be.false &&
            expect(dispatcher.hasListeners('postFoo')).to.be.false;
    });

    it('remove subscriber with priorities', function () {
        let subscriber, dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(subscriber = new TestEventSubscriberWithPriorities());

        let ret = expect(dispatcher.hasListeners('preFoo')).to.be.true;

        dispatcher.removeSubscriber(subscriber);
        return ret && expect(dispatcher.hasListeners('preFoo')).to.be.false;
    });

    it('add subscriber with multiple listeners', function () {
        let subscriber, dispatcher = createEventDispatcher();
        dispatcher.addSubscriber(subscriber = new TestEventSubscriberWithMultipleListeners());

        let ret = expect(dispatcher.hasListeners('preFoo')).to.be.true &&
                    expect(Array.from(dispatcher.getListeners('preFoo'))).to.have.lengthOf(2);

        dispatcher.removeSubscriber(subscriber);
        return ret && expect(dispatcher.hasListeners('preFoo')).to.be.false;
    });

    it('receives correct arguments', function () {
        let name, instance;
        let dispatcher = createEventDispatcher();

        dispatcher.addListener('preFoo', (e, n, i) => {
            name = n;
            instance = i;
        });
        dispatcher.dispatch('preFoo');

        return expect(name).to.be.equal('preFoo') &&
                expect(instance).to.be.equal(dispatcher);
    });
});
