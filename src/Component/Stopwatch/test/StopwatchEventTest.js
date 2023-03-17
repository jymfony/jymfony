import { performance } from 'perf_hooks';

const StopwatchEvent = Jymfony.Component.Stopwatch.StopwatchEvent;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const microtime = () => ((performance.now() + performance.timeOrigin) / 1000);

export default @timeSensitive() class StopwatchEventTest extends TestCase {
    get testCaseName() {
        return '[Stopwatch] ' + super.testCaseName;
    }

    testOrigin() {
        const event = new StopwatchEvent(12);
        __self.assertEquals(12, event.origin);
    }

    testCategory() {
        let event = new StopwatchEvent(0);
        __self.assertEquals('default', event.category);

        event = new StopwatchEvent(0, 'cat');
        __self.assertEquals('cat', event.category);
    }

    testGetPeriods() {
        let event = new StopwatchEvent(microtime());
        __self.assertEquals([], event.periods);

        event = new StopwatchEvent(microtime());
        event.start();
        event.stop();
        __self.assertCount(1, event.periods);

        event = new StopwatchEvent(microtime());
        event.start();
        event.stop();
        event.start();
        event.stop();
        __self.assertCount(2, event.periods);
    }

    testLap() {
        const event = new StopwatchEvent(microtime());
        event.start();
        event.lap();
        event.stop();
        __self.assertCount(2, event.periods);
    }

    async testDuration() {
        let event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(200);
        event.stop();
        __self.assertEquals(.2, event.duration);

        event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(100);
        event.stop();
        await __jymfony.sleep(50);
        event.start();
        await __jymfony.sleep(100);
        event.stop();
        __self.assertEquals(.2, event.duration);
    }

    async testDurationBeforeStop() {
        let event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(200);
        event.stop();
        __self.assertEquals(.2, event.duration);
        event = new StopwatchEvent(microtime());

        event.start();
        await __jymfony.sleep(100);
        event.stop();
        await __jymfony.sleep(50);
        event.start();
        await __jymfony.sleep(100);
        __self.assertEquals(.1, event.duration);
    }

    testStopBeforeStartShouldThrow() {
        const event = new StopwatchEvent(microtime());

        this.expectException(LogicException);
        event.stop();
    }

    testIsStarted() {
        const event = new StopwatchEvent(microtime());

        __self.assertEquals(false, event.isStarted());
        event.start();
        __self.assertEquals(true, event.isStarted());
    }

    async testEnsureStopped() {
        const event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(100);
        event.start();
        await __jymfony.sleep(100);
        event.ensureStopped();

        __self.assertEquals(.3, event.duration);
    }

    async testStartTime() {
        let event = new StopwatchEvent(microtime());
        __self.assertEquals(0, event.startTime);

        event.start();
        event.stop();
        __self.assertEquals(0, event.startTime);

        event = new StopwatchEvent(microtime());
        event.start();
        await __jymfony.sleep(100);
        event.stop();
        __self.assertEquals(0, event.startTime);
    }

    testToString() {
        let event = new StopwatchEvent(microtime());
        __self.assertEquals('default: 0.00 MiB - 0 ms', event.toString());

        event.start();
        event.stop();
        __self.assertMatchesRegularExpression(/default: [0-9.]+ MiB - [0-9]+ ms/, event.toString());

        event = new StopwatchEvent(microtime(), 'foo');
        __self.assertEquals('foo: 0.00 MiB - 0 ms', event.toString());
    }
}
