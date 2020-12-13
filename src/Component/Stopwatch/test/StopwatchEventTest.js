import { expect } from 'chai';
import { performance } from 'perf_hooks';

const StopwatchEvent = Jymfony.Component.Stopwatch.StopwatchEvent;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const TimeSensitiveTestCaseTrait = Jymfony.Component.Testing.Framework.TimeSensitiveTestCaseTrait;

const microtime = () => ((performance.now() + performance.timeOrigin) / 1000);

export default class StopwatchEventTest extends mix(TestCase, TimeSensitiveTestCaseTrait) {
    get testCaseName() {
        return '[Stopwatch] ' + super.testCaseName;
    }

    testOrigin() {
        const event = new StopwatchEvent(12);
        expect(event.origin).to.be.equal(12);
    }

    testCategory() {
        let event = new StopwatchEvent(0);
        expect(event.category).to.be.equal('default');

        event = new StopwatchEvent(0, 'cat');
        expect(event.category).to.be.equal('cat');
    }

    testGetPeriods() {
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
    }

    testLap() {
        const event = new StopwatchEvent(microtime());
        event.start();
        event.lap();
        event.stop();
        expect(event.periods).to.have.length(2);
    }

    async testDuration() {
        let event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(200);
        event.stop();
        expect(event.duration).to.be.equal(.2);

        event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(100);
        event.stop();
        await __jymfony.sleep(50);
        event.start();
        await __jymfony.sleep(100);
        event.stop();
        expect(event.duration).to.be.equal(.2);
    }

    async testDurationBeforeStop() {
        let event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(200);
        event.stop();
        expect(event.duration).to.be.equal(.2);
        event = new StopwatchEvent(microtime());

        event.start();
        await __jymfony.sleep(100);
        event.stop();
        await __jymfony.sleep(50);
        event.start();
        await __jymfony.sleep(100);
        expect(event.duration).to.be.equal(.1);
    }

    testStopBeforeStartShouldThrow() {
        const event = new StopwatchEvent(microtime());
        expect(() => event.stop()).to.throw(LogicException);
    }

    testIsStarted() {
        const event = new StopwatchEvent(microtime());

        expect(event.isStarted()).to.be.equal(false);
        event.start();
        expect(event.isStarted()).to.be.equal(true);
    }

    async testEnsureStopped() {
        const event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(100);
        event.start();
        await __jymfony.sleep(100);
        event.ensureStopped();

        expect(event.duration).to.be.equal(.3);
    }

    async testStartTime() {
        let event = new StopwatchEvent(microtime());
        expect(event.startTime).to.be.equal(0);

        event.start();
        event.stop();
        expect(event.startTime).to.be.equal(0);

        event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(100);
        event.stop();
        expect(event.startTime).to.be.equal(0);
    }

    testToString() {
        let event = new StopwatchEvent(microtime());
        expect(event.toString()).to.be.equal('default: 0.00 MiB - 0 ms');

        event.start();
        event.stop();
        expect(event.toString()).to.match(/default: [0-9.]+ MiB - [0-9]+ ms/);

        event = new StopwatchEvent(microtime(), 'foo');
        expect(event.toString()).to.be.equal('foo: 0.00 MiB - 0 ms');
    }
}
