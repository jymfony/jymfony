import { expect } from 'chai';

const Stopwatch = Jymfony.Component.Stopwatch.Stopwatch;
const StopwatchEvent = Jymfony.Component.Stopwatch.StopwatchEvent;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class StopwatchTest extends TestCase {
    get testCaseName() {
        return '[Stopwatch] ' + super.testCaseName;
    }

    testStart() {
        const stopwatch = new Stopwatch();
        const event = stopwatch.start('foo', 'cat');

        expect(event).to.be.instanceOf(StopwatchEvent);
        expect(event.category).to.be.equal('cat');
        expect(stopwatch.getEvent('foo')).to.be.equal(event);
    }

    testStartWithoutCategory() {
        const stopwatch = new Stopwatch();
        const event = stopwatch.start('bar');

        expect(event.category).to.be.equal('default');
        expect(stopwatch.getEvent('bar')).to.be.equal(event);
    }

    testIsStarted() {
        const stopwatch = new Stopwatch();

        expect(stopwatch.isStarted('foo')).to.be.equal(false);
        stopwatch.start('foo', 'cat');
        expect(stopwatch.isStarted('foo')).to.be.equal(true);
        stopwatch.stop('foo');
        expect(stopwatch.isStarted('foo')).to.be.equal(false);
    }

    testGetEventShouldThrowOnUnknownEvent() {
        const stopwatch = new Stopwatch();
        expect(() => stopwatch.getEvent('foo')).to.throw(LogicException);
    }

    testStopWithoutStart() {
        const stopwatch = new Stopwatch();
        expect(() => stopwatch.stop('foo')).to.throw(LogicException);
    }

    testSections() {
        const stopwatch = new Stopwatch();

        stopwatch.openSection();
        stopwatch.start('foo', 'cat');
        stopwatch.stop('foo');
        stopwatch.start('bar', 'cat');
        stopwatch.stop('bar');
        stopwatch.stopSection('1');

        stopwatch.openSection();
        stopwatch.start('foobar', 'cat');
        stopwatch.stop('foobar');
        stopwatch.stopSection('2');

        stopwatch.openSection();
        stopwatch.start('foobar', 'cat');
        stopwatch.stop('foobar');
        stopwatch.stopSection('0');

        expect(Object.keys(stopwatch.getSectionEvents('1'))).to.have.length(3);
        expect(Object.keys(stopwatch.getSectionEvents('2'))).to.have.length(2);
        expect(Object.keys(stopwatch.getSectionEvents('0'))).to.have.length(2);
    }

    testReopenSection() {
        const stopwatch = new Stopwatch();

        stopwatch.openSection();
        stopwatch.start('foo', 'cat');
        stopwatch.stopSection('section');

        stopwatch.openSection('section');
        stopwatch.start('bar', 'cat');
        stopwatch.stopSection('section');

        const events = stopwatch.getSectionEvents('section');

        expect(Object.keys(events)).to.have.length(3);
        expect(events['__section__'].periods).to.have.length(2);
    }
}
