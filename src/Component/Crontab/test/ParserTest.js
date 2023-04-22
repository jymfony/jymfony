const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
const Parser = Jymfony.Component.Crontab.Parser;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const VarDumperTestTrait = Jymfony.Component.VarDumper.Test.VarDumperTestTrait;

export default class ParserTest extends mix(TestCase, VarDumperTestTrait) {
    _parser;

    beforeEach() {
        this._parser = new Parser();
    }

    testShouldParseAllStarsSeconds() {
        const crontab = this._parser.parse('* * * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:01', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:02', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:03', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:04', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:05', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseASingleValueSeconds() {
        const crontab = this._parser.parse('1 * * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:01', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:01', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:02:01', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:03:01', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:04:01', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:05:01', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleValuesSeconds() {
        const crontab = this._parser.parse('0,5,10 * * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:05', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:10', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:05', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:10', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleUnsortedValuesSeconds() {
        const crontab = this._parser.parse('0,10,5 * * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:05', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:10', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:05', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:10', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseRangeValuesSecondsWithIncrement() {
        const crontab = this._parser.parse('1-6/2 * * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:01', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:03', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:05', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:01', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:03', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:05', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseStarWithIncrement() {
        const crontab = this._parser.parse('*/10 * * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:10', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:20', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:30', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:40', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:50', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParse0SecondsWithIncrement() {
        const crontab = this._parser.parse('0/10 * * * * *', new DateTime('2020-08-07 00:00:32', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:40', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:50', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:10', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNonZeroSecondsWithIncrement() {
        const crontab = this._parser.parse('5/15 * * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:05', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:20', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:35', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:00:50', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:05', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseAllStarsMinutes() {
        const crontab = this._parser.parse('0 * * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:02:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:03:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:04:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:06:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseSingleValue() {
        const crontab = this._parser.parse('0 1 * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 02:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 03:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 04:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleValuesMinutes() {
        const crontab = this._parser.parse('0 0,5,10 * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:10:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleUnsortedValuesMinutes() {
        const crontab = this._parser.parse('0 0,10,5 * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:10:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseRangeValueWithIncrementMinutes() {
        const crontab = this._parser.parse('0 1-6/2 * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:03:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:03:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseStarWithIncrementMinutes() {
        const crontab = this._parser.parse('0 */10 * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:10:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:20:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:30:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:40:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:50:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParse0WithIncrementMinutes() {
        const crontab = this._parser.parse('0 0/10 * * * *', new DateTime('2020-08-07 00:32:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:40:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:50:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:10:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNonZeroWithIncrementMinutes() {
        const crontab = this._parser.parse('0 5/15 * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:20:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:35:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 00:50:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseAllStarsHours() {
        const crontab = this._parser.parse('0 0 * * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 02:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 03:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 04:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 05:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 06:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseSingleValueHours() {
        const crontab = this._parser.parse('0 0 1 * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-09 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-10 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-11 01:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleValuesHours() {
        const crontab = this._parser.parse('0 0 0,5,10 * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 05:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 10:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 05:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleUnsortedValuesHours() {
        const crontab = this._parser.parse('0 0 0,10,5 * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 05:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 10:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 05:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseRangeValueWithIncrementHours() {
        const crontab = this._parser.parse('0 0 1-6/2 * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 03:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 01:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 03:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 05:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseStarWithIncrementHours() {
        const crontab = this._parser.parse('0 0 */3 * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 03:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 06:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 09:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 12:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 15:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 18:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParse0WithIncrementHours() {
        const crontab = this._parser.parse('0 0 0/10 * * *', new DateTime('2020-08-07 03:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 10:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 20:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 10:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 20:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNonZeroWithIncrementHours() {
        const crontab = this._parser.parse('0 0 5/12 * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 05:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-07 17:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 05:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 17:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseAllStarsDayOfMonth() {
        const crontab = this._parser.parse('0 0 0 * * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-09 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-10 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-12 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-13 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseSingleValueDayOfMonth() {
        const crontab = this._parser.parse('0 0 0 1 * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-09-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-11-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-12-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleValueDayOfMonth() {
        const crontab = this._parser.parse('0 0 0 1,5,10 * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-10 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-10 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleUnsortedValuesDayOfMonth() {
        const crontab = this._parser.parse('0 0 0 1,10,5 * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-10 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-10 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseRangeValueWithIncrementDayOfMonth() {
        const crontab = this._parser.parse('0 0 0 1-6/2 * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-09-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-03 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-03 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseStarWithIncrementDayOfMonth() {
        const crontab = this._parser.parse('0 0 0 */3 * *', new DateTime('2020-08-06 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-10 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-13 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-16 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-19 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-22 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-25 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParse0WithIncrementDayOfMonth() {
        const crontab = this._parser.parse('0 0 0 0/10 * *', new DateTime('2020-08-07 03:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-21 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-31 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-21 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNonZeroWithIncrementDayOfMonth() {
        const crontab = this._parser.parse('0 0 0 5/10 * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-15 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-08-25 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-15 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseLastDayOfMonthFlag() {
        const crontab = this._parser.parse('0 0 0 L * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-31 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-30 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-31 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-11-30 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNearestFirstWeekday() {
        const crontab = this._parser.parse('0 0 0 1W * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-09-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-11-02 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-12-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNearestSingleWeekday() {
        const crontab = this._parser.parse('0 0 0 15W * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-14 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-15 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-15 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-11-16 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-12-15 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-15 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNearestMultipleWeekday() {
        const crontab = this._parser.parse('0 0 0 4W,15W * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-08-14 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-09-15 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-15 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-11-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-11-16 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseAllStarsMonth() {
        const crontab = this._parser.parse('0 0 0 1 * *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-09-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-11-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2020-12-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseSingleValueMonth() {
        const crontab = this._parser.parse('0 0 0 1 1 *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2022-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2023-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNamedMonthValue() {
        const crontab = this._parser.parse('0 0 0 1 JAN *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2022-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2023-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleValuesMonth() {
        const crontab = this._parser.parse('0 0 0 1 1,5,10 *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-05-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleNamedMonthValues() {
        const crontab = this._parser.parse('0 0 0 1 JAN,MAY,OCT *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-05-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleUnsortedMonthValues() {
        const crontab = this._parser.parse('0 0 0 1 1,10,5 *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-05-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleNamedUnsortedMonthValues() {
        const crontab = this._parser.parse('0 0 0 1 MAY,JAN,OCT *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-05-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseRangeValueWithIncrement() {
        const crontab = this._parser.parse('0 0 0 1 1-6/2 *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-03-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-05-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2022-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2022-03-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2022-05-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseRangeNamedValueWithIncrement() {
        const crontab = this._parser.parse('0 0 0 1 JAN-JUN/2 *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-03-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-05-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2022-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2022-03-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2022-05-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseStarWithIncrementMonth() {
        const crontab = this._parser.parse('0 0 0 1 */3 *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-04-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-07-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-10-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParse0WithIncrementMonth() {
        const crontab = this._parser.parse('0 0 0 1 0/10 *', new DateTime('2020-08-07 03:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-11-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-11-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNonZeroWithIncrementMonth() {
        const crontab = this._parser.parse('0 0 0 1 3/6 *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2020-09-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-03-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-09-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseAllStarsDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 ? 1 *', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-02 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-03 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseSingleValueDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 ? 1 1', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-18 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNamedDayOfWeekNamedSingleValue() {
        const crontab = this._parser.parse('0 0 0 ? 1 MON', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-18 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleValuesDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 ? 1 1,2,5', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-12 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleNamedValuesDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 ? 1 MON,TUE,FRI', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-12 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleUnsortedValuesDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 ? 1 5,1,2', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-12 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseMultipleNamedDayOfWeekUnsortedValues() {
        const crontab = this._parser.parse('0 0 0 ? JAN FRI,TUE,MON', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-12 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseRangeValueWithIncrementDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 ? 1 1-5/2', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-06 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-13 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseRangeWithNamedValuesAndIncrementDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 ? 1 MON-FRI/2', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-04 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-06 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-11 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-13 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseStarWithIncrementDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 * 1 */3', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-02 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-03 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-06 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-09 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseZeroWithIncrementDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 ? 1 0/5', new DateTime('2020-08-07 03:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-01 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-03 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-08 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-10 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-15 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseNonZeroWithIncrementDayOfWeek() {
        const crontab = this._parser.parse('0 0 0 ? 1 3/6', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const itr = crontab[Symbol.iterator]();

        this.assertDumpEquals(new DateTime('2021-01-06 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-13 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-20 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2021-01-27 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
        this.assertDumpEquals(new DateTime('2022-01-05 00:00:00', DateTimeZone.get('Europe/Rome')), itr.next().value);
    }

    testShouldParseSimpleCrontabExpression() {
        const crontab = this._parser.parse('0 0 09-18 * * 1-5', new DateTime('2020-08-07 00:00:00', DateTimeZone.get('Europe/Rome')));
        const result = [];

        for (const dt of crontab) {
            if (25 === result.length) {
                break;
            }

            result.push(dt);
        }

        this.assertDumpEquals(`array:25 [
  0 => Jymfony.Component.DateTime.DateTime @1596783600 {
    date: 2020-08-07T09:00:00.000+02:00
  },
  1 => Jymfony.Component.DateTime.DateTime @1596787200 {
    date: 2020-08-07T10:00:00.000+02:00
  },
  2 => Jymfony.Component.DateTime.DateTime @1596790800 {
    date: 2020-08-07T11:00:00.000+02:00
  },
  3 => Jymfony.Component.DateTime.DateTime @1596794400 {
    date: 2020-08-07T12:00:00.000+02:00
  },
  4 => Jymfony.Component.DateTime.DateTime @1596798000 {
    date: 2020-08-07T13:00:00.000+02:00
  },
  5 => Jymfony.Component.DateTime.DateTime @1596801600 {
    date: 2020-08-07T14:00:00.000+02:00
  },
  6 => Jymfony.Component.DateTime.DateTime @1596805200 {
    date: 2020-08-07T15:00:00.000+02:00
  },
  7 => Jymfony.Component.DateTime.DateTime @1596808800 {
    date: 2020-08-07T16:00:00.000+02:00
  },
  8 => Jymfony.Component.DateTime.DateTime @1596812400 {
    date: 2020-08-07T17:00:00.000+02:00
  },
  9 => Jymfony.Component.DateTime.DateTime @1596816000 {
    date: 2020-08-07T18:00:00.000+02:00
  },
  10 => Jymfony.Component.DateTime.DateTime @1597042800 {
    date: 2020-08-10T09:00:00.000+02:00
  },
  11 => Jymfony.Component.DateTime.DateTime @1597046400 {
    date: 2020-08-10T10:00:00.000+02:00
  },
  12 => Jymfony.Component.DateTime.DateTime @1597050000 {
    date: 2020-08-10T11:00:00.000+02:00
  },
  13 => Jymfony.Component.DateTime.DateTime @1597053600 {
    date: 2020-08-10T12:00:00.000+02:00
  },
  14 => Jymfony.Component.DateTime.DateTime @1597057200 {
    date: 2020-08-10T13:00:00.000+02:00
  },
  15 => Jymfony.Component.DateTime.DateTime @1597060800 {
    date: 2020-08-10T14:00:00.000+02:00
  },
  16 => Jymfony.Component.DateTime.DateTime @1597064400 {
    date: 2020-08-10T15:00:00.000+02:00
  },
  17 => Jymfony.Component.DateTime.DateTime @1597068000 {
    date: 2020-08-10T16:00:00.000+02:00
  },
  18 => Jymfony.Component.DateTime.DateTime @1597071600 {
    date: 2020-08-10T17:00:00.000+02:00
  },
  19 => Jymfony.Component.DateTime.DateTime @1597075200 {
    date: 2020-08-10T18:00:00.000+02:00
  },
  20 => Jymfony.Component.DateTime.DateTime @1597129200 {
    date: 2020-08-11T09:00:00.000+02:00
  },
  21 => Jymfony.Component.DateTime.DateTime @1597132800 {
    date: 2020-08-11T10:00:00.000+02:00
  },
  22 => Jymfony.Component.DateTime.DateTime @1597136400 {
    date: 2020-08-11T11:00:00.000+02:00
  },
  23 => Jymfony.Component.DateTime.DateTime @1597140000 {
    date: 2020-08-11T12:00:00.000+02:00
  },
  24 => Jymfony.Component.DateTime.DateTime @1597143600 {
    date: 2020-08-11T13:00:00.000+02:00
  }
]
`, result);
    }
}
