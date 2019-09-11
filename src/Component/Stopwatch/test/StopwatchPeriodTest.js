const StopwatchPeriod = Jymfony.Component.Stopwatch.StopwatchPeriod;
const { expect } = require('chai');

describe('[Stopwatch] StopwatchPeriod', function () {
    it('start time', () => {
        let period = new StopwatchPeriod(0.0, 0.0);
        expect(period.startTime).to.be.equal(.0);

        period = new StopwatchPeriod(2.71, 2.71);
        expect(period.startTime).to.be.equal(2.71);
    });

    it('end time', () => {
        let period = new StopwatchPeriod(0, 0);
        expect(period.endTime).to.be.equal(0);

        period = new StopwatchPeriod(2.71, 2.71);
        expect(period.endTime).to.be.equal(2.71);
    });

    const durationValues = function * () {
        yield [ 0, 0, 0 ];
        yield [ 2, 3.14, 1.14 ];
        yield [ 2.71, 3.14, 0.43 ];
    };

    for (const [ start, end, duration ] of durationValues()) {
        it('duration', () => {
            const period = new StopwatchPeriod(start, end);
            expect(period.duration).to.be.equal(duration);
        });
    }
});
