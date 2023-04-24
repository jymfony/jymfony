import { expect } from 'chai';

const StopwatchPeriod = Jymfony.Component.Stopwatch.StopwatchPeriod;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class StopwatchPeriodTest extends TestCase {
    get testCaseName() {
        return '[Stopwatch] ' + super.testCaseName;
    }

    testStartTime() {
        let period = new StopwatchPeriod(0.0, 0.0);
        expect(period.startTime).to.be.equal(.0);

        period = new StopwatchPeriod(2.71, 2.71);
        expect(period.startTime).to.be.equal(2.71);
    }

    testEndTime() {
        let period = new StopwatchPeriod(0, 0);
        expect(period.endTime).to.be.equal(0);

        period = new StopwatchPeriod(2.71, 2.71);
        expect(period.endTime).to.be.equal(2.71);
    }

    * provideDurationValues() {
        yield [ 0, 0, 0 ];
        yield [ 2, 3.14, 1.14 ];
        yield [ 2.71, 3.14, 0.43 ];
    }

    @dataProvider('provideDurationValues')
    testDuration(start, end, duration) {
        const period = new StopwatchPeriod(start, end);
        expect(period.duration).to.be.equal(duration);
    }
}
