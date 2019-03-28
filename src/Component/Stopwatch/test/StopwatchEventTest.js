const StopwatchEvent = Jymfony.Component.Stopwatch.StopwatchEvent;
const expect = require('chai').expect;
const { performance } = require('perf_hooks');

const microtime = () => ((performance.now() + performance.timeOrigin) / 1000);

class TestEvent extends StopwatchEvent {
    __construct(origin, category = null) {
        this._now = microtime();

        super.__construct(this._now, category);
    }

    addToNow(num) {
        this._now += num;
    }

    _getNow() {
        return this._formatTime(this._now - this._origin);
    }
}

describe('[Stopwatch] StopwatchEvent', function () {
    it('origin', () => {
        const event = new StopwatchEvent(12);
        expect(event.origin).to.be.equal(12);
    });

    it('category', () => {
        let event = new StopwatchEvent(0);
        expect(event.category).to.be.equal('default');

        event = new StopwatchEvent(0, 'cat');
        expect(event.category).to.be.equal('cat');
    });

    it('get periods', () => {
        let event = new StopwatchEvent(microtime());
        expect(event.periods).to.be.deep.equal([]);

        event = new StopwatchEvent(microtime());
        event.start();
        event.stop();
        expect(event.periods).to.have.length(1);

        event = new StopwatchEvent(microtime());
        event.start();
        event.stop();
        event.start();
        event.stop();
        expect(event.periods).to.have.length(2);
    });

    it('lap', () => {
        const event = new StopwatchEvent(microtime());
        event.start();
        event.lap();
        event.stop();
        expect(event.periods).to.have.length(2);
    });

    it('duration', () => {
        let event = new TestEvent();
        event.start();
        event.addToNow(200);
        event.stop();
        expect(event.duration).to.be.equal(200);

        event = new TestEvent();
        event.start();
        event.addToNow(100);
        event.stop();
        event.addToNow(50);
        event.start();
        event.addToNow(100);
        event.stop();
        expect(event.duration).to.be.equal(200);
    });

    it('duration before stop', () => {
        let event = new TestEvent();
        event.start();
        event.addToNow(200);
        event.stop();
        expect(event.duration).to.be.equal(200);

        event = new TestEvent();
        event.start();
        event.addToNow(100);
        event.stop();
        event.addToNow(50);
        event.start();
        event.addToNow(100);
        expect(event.duration).to.be.equal(100);
    });

    it('stop before start should throw', () => {
        const event = new StopwatchEvent(microtime());

        expect(() => event.stop()).to.throw(LogicException);
    });

    it('is started', () => {
        const event = new StopwatchEvent(microtime());

        expect(event.isStarted()).to.be.equal(false);
        event.start();
        expect(event.isStarted()).to.be.equal(true);
    });

    it('ensure stopped', () => {
        const event = new TestEvent();
        event.start();
        event.addToNow(100);
        event.start();
        event.addToNow(100);
        event.ensureStopped();

        expect(event.duration).to.be.equal(300);
    });

    it('start time', () => {
        let event = new StopwatchEvent(microtime());
        expect(event.startTime).to.be.equal(0);

        event.start();
        event.stop();
        expect(event.startTime).to.be.equal(0);

        event = new TestEvent();
        event.start();
        event.addToNow(100);
        event.stop();
        expect(event.startTime).to.be.equal(0);
    });

    it('toString', () => {
        let event = new StopwatchEvent(microtime());
        expect(event.toString()).to.be.equal('default: 0.00 MiB - 0 ms');

        event.start();
        event.stop();
        expect(event.toString()).to.match(/default: [0-9.]+ MiB - [0-9]+ ms/);

        event = new StopwatchEvent(microtime(), 'foo');
        expect(event.toString()).to.be.equal('foo: 0.00 MiB - 0 ms');
    });
});
