const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
const Parser = Jymfony.Component.DateTime.Parser.Parser;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class ParserTest extends TestCase {
    get testCaseName() {
        return '[DateTime] ' + super.testCaseName;
    }

    * provideHHMMTimes() {
        yield [ '04:08', '12.45', '19.19', '23:43' ];
        yield [ 'T04:08', 'T12.45', 'T19.19', 'T23:43' ];
        yield [ '0408', '1245', '1919', '2343' ];
        yield [ 'T0408', 'T1245', 'T1919', 'T2343' ];
    }

    @dataProvider('provideHHMMTimes')
    testShouldParseCorrectly24HoursTimeWithoutSeconds(t0, t1, t2, t3) {
        let tm;
        const parser = new Parser();

        tm = parser.parse(t0);
        __self.assertEquals(4, tm.hour);
        __self.assertEquals(8, tm.minutes);
        __self.assertEquals(0, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);

        tm = parser.parse(t1);
        __self.assertEquals(12, tm.hour);
        __self.assertEquals(45, tm.minutes);
        __self.assertEquals(0, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);

        tm = parser.parse(t2);
        __self.assertEquals(19, tm.hour);
        __self.assertEquals(19, tm.minutes);
        __self.assertEquals(0, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);

        tm = parser.parse(t3);
        __self.assertEquals(23, tm.hour);
        __self.assertEquals(43, tm.minutes);
        __self.assertEquals(0, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);
    }

    * provideHHMMIITimes() {
        yield [ '04:08:37', '12.45.45', '19.19.19', '23:43:57' ];
        yield [ 'T04:08:37', 'T12.45.45', 'T19.19.19', 'T23:43:57' ];
        yield [ '040837', '124545', '191919', '234357' ];
        yield [ 'T040837', 'T124545', 'T191919', 'T234357' ];
    }

    @dataProvider('provideHHMMIITimes')
    testShouldParseCorrectly24HoursTimeWithSeconds(t0, t1, t2, t3) {
        let tm;
        const parser = new Parser();

        tm = parser.parse(t0);
        __self.assertEquals(4, tm.hour);
        __self.assertEquals(8, tm.minutes);
        __self.assertEquals(37, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);

        tm = parser.parse(t1);
        __self.assertEquals(12, tm.hour);
        __self.assertEquals(45, tm.minutes);
        __self.assertEquals(45, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);

        tm = parser.parse(t2);
        __self.assertEquals(19, tm.hour);
        __self.assertEquals(19, tm.minutes);
        __self.assertEquals(19, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);

        tm = parser.parse(t3);
        __self.assertEquals(23, tm.hour);
        __self.assertEquals(43, tm.minutes);
        __self.assertEquals(57, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);
    }

    * provide12HTimes4am() {
        yield [ '4A' ];
        yield [ '4a' ];
        yield [ '4am' ];
        yield [ '4a.m.' ];
        yield [ '4 A' ];
        yield [ '4 a' ];
        yield [ '4 am' ];
        yield [ '4 a.m.' ];
    }

    @dataProvider('provide12HTimes4am')
    testShouldParseCorrectly12HoursTimeHoursAM(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertEquals(4, tm.hour);
        __self.assertEquals(0, tm.minutes);
        __self.assertEquals(0, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);
    }

    * provide12HTimes4pm() {
        yield [ '4P' ];
        yield [ '4p' ];
        yield [ '4pm' ];
        yield [ '4p.m.' ];
        yield [ '4 P' ];
        yield [ '4 p' ];
        yield [ '4 pm' ];
        yield [ '4 p.m.' ];
    }

    @dataProvider('provide12HTimes4pm')
    testShouldParseCorrectly12HoursTimeHoursPM(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertEquals(16, tm.hour);
        __self.assertEquals(0, tm.minutes);
        __self.assertEquals(0, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);
    }

    * provide12HTimes408am() {
        yield [ '4.08A' ];
        yield [ '4:08a' ];
        yield [ '4.08am' ];
        yield [ '4:08a.m.' ];
        yield [ '4.08 A' ];
        yield [ '4:08 a' ];
        yield [ '4.08 am' ];
        yield [ '4:08 a.m.' ];
    }

    @dataProvider('provide12HTimes408am')
    testShouldParseCorrectly12HoursTimeHoursMinutesAM(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertEquals(4, tm.hour);
        __self.assertEquals(8, tm.minutes);
        __self.assertEquals(0, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);
    }

    * provide12HTimes436pm() {
        yield [ '4.36P' ];
        yield [ '4:36p' ];
        yield [ '4.36pm' ];
        yield [ '4:36p.m.' ];
        yield [ '4.36 P' ];
        yield [ '4:36 p' ];
        yield [ '4.36 pm' ];
        yield [ '4:36 p.m.' ];
    }

    @dataProvider('provide12HTimes436pm')
    testShouldParseCorrectly12HoursTimeHoursMinutesPM(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertEquals(16, tm.hour);
        __self.assertEquals(36, tm.minutes);
        __self.assertEquals(0, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);
    }

    * provide12HTimes40814am() {
        yield [ '4.08.14A' ];
        yield [ '4:08:14a' ];
        yield [ '4.08.14am' ];
        yield [ '4:08:14a.m.' ];
        yield [ '4.08.14 A' ];
        yield [ '4:08:14 a' ];
        yield [ '4.08.14 am' ];
        yield [ '4:08:14 a.m.' ];
    }

    @dataProvider('provide12HTimes40814am')
    testShouldParseCorrectly12HoursTimeHoursMinutesSecondsAM(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertEquals(4, tm.hour);
        __self.assertEquals(8, tm.minutes);
        __self.assertEquals(14, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);
    }

    * provide12HTimes43627pm() {
        yield [ '4.36.27P' ];
        yield [ '4:36:27p' ];
        yield [ '4.36.27pm' ];
        yield [ '4:36:27p.m.' ];
        yield [ '4.36.27 P' ];
        yield [ '4:36:27 p' ];
        yield [ '4.36.27 pm' ];
        yield [ '4:36:27 p.m.' ];
    }

    @dataProvider('provide12HTimes43627pm')
    testShouldParseCorrectly12HoursTimeHoursMinutesSecondsPM(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertEquals(16, tm.hour);
        __self.assertEquals(36, tm.minutes);
        __self.assertEquals(27, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);
    }

    * provide12HTimes40814microam() {
        yield [ '4:08:14:34567A' ];
        yield [ '4:08:14:3456a' ];
        yield [ '4:08:14:345670am' ];
        yield [ '4:08:14:345a.m.' ];
        yield [ '4:08:14:34567 A' ];
        yield [ '4:08:14:3456 a' ];
        yield [ '4:08:14:345670 am' ];
        yield [ '4:08:14:345 a.m.' ];
    }

    @dataProvider('provide12HTimes40814microam')
    testShouldParseCorrectly12HoursTimeHoursMinutesSecondsMicrosecondsAM(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertEquals(4, tm.hour);
        __self.assertEquals(8, tm.minutes);
        __self.assertEquals(14, tm.seconds);
        __self.assertEquals(345, tm.milliseconds);
    }

    * provide12HTimes43627micropm() {
        yield [ '4:36:27:34567P' ];
        yield [ '4:36:27:3456p' ];
        yield [ '4:36:27:345670pm' ];
        yield [ '4:36:27:345p.m.' ];
        yield [ '4:36:27:34567 P' ];
        yield [ '4:36:27:3456 p' ];
        yield [ '4:36:27:345670 pm' ];
        yield [ '4:36:27:345 p.m.' ];
    }

    @dataProvider('provide12HTimes43627micropm')
    testShouldParseCorrectly12HoursTimeHoursMinutesSecondsMicrosecondsPM(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertEquals(16, tm.hour);
        __self.assertEquals(36, tm.minutes);
        __self.assertEquals(27, tm.seconds);
        __self.assertEquals(345, tm.milliseconds);
    }

    * provideTimezones() {
        yield [ 'GMT' ];
        yield [ 'CEST' ];
        yield [ 'Europe/Rome' ];
        yield [ 'GMT+0700' ];
        yield [ 'GMT-04:00' ];
    }

    @dataProvider('provideTimezones')
    testShouldParseCorrectlyTimezone(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertInstanceOf(DateTimeZone, tm.timeZone);
        __self.assertEquals(t, tm.timeZone.name);
    }

    * provideDates() {
        yield [ '2017-03-09' ];
        yield [ '2017/03/09' ];
        yield [ '20170309' ];
        yield [ '17-03-09' ];
        yield [ '@1489017600' ];
        yield [ '+2017-03-09' ];
        yield [ '2017-03-09T00:00:00+0000' ];
        yield [ '2017-03-09T00:00:00Z' ];
        yield [ '2017 Mar 09  0:00' ];
        yield [ '09 Mar 2017 00:00' ];
        yield [ 'mar 09 2017 00:00' ];
    }

    @dataProvider('provideDates')
    testShouldParseCorrectlyDate(t) {
        const parser = new Parser();

        const tm = parser.parse(t);
        __self.assertEquals(0, tm.hour);
        __self.assertEquals(0, tm.minutes);
        __self.assertEquals(0, tm.seconds);
        __self.assertEquals(0, tm.milliseconds);
        __self.assertEquals(2017, tm._year);
        __self.assertEquals(3, tm.month);
        __self.assertEquals(9, tm.day);
    }

    testShouldReturnCorrectComputedDates() {
        const parser = new Parser();

        const tm = parser.parse('2017-03-09', 'Etc/UTC');
        __self.assertEquals(4, tm.weekDay);
        __self.assertEquals(68, tm.yearDay);
        __self.assertEquals(10, tm.isoWeekNumber);
        __self.assertEquals(false, tm.leap);
        __self.assertEquals(17234, tm.daysFromEpoch);
        __self.assertEquals(1489017600, tm.unixTimestamp);
    }

    testShouldParseNow() {
        const parser = new Parser();

        const currentDate = new Date();
        const tm = parser.parse('now');
        __self.assertEquals(currentDate.getUTCFullYear(), tm._year);
    }

    * provideDateExpressionTests() {
        yield [ 'thursday', tm => __self.assertEquals(4, tm.weekDay) ];
        yield [ 'november', tm => __self.assertEquals(11, tm.month) ];
        yield [ 'january', tm => __self.assertEquals(1, tm.month) ];
        yield [ 'friday 13:00', tm => {
            __self.assertEquals(5, tm.weekDay);
            __self.assertEquals(13, tm.hour);
            __self.assertEquals(0, tm.minutes);
            __self.assertEquals(0, tm.seconds);
        } ];
        yield [ 'mon 02.35', tm => {
            __self.assertEquals(1, tm.weekDay);
            __self.assertEquals(2, tm.hour);
            __self.assertEquals(35, tm.minutes);
            __self.assertEquals(0, tm.seconds);
        } ];
        yield [ 'mon 2.35am', tm => {
            __self.assertEquals(1, tm.weekDay);
            __self.assertEquals(2, tm.hour);
            __self.assertEquals(35, tm.minutes);
            __self.assertEquals(0, tm.seconds);
        } ];
        yield [ '6 in the morning', tm => {
            __self.assertEquals(6, tm.hour);
            __self.assertEquals(0, tm.minutes);
            __self.assertEquals(0, tm.seconds);
        } ];
        yield [ 'sat 7 in the evening', tm => {
            __self.assertEquals(6, tm.weekDay);
            __self.assertEquals(19, tm.hour);
            __self.assertEquals(0, tm.minutes);
            __self.assertEquals(0, tm.seconds);
        } ];
        yield [ 'yesterday', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() - 1);

            __self.assertEquals(d.getUTCDate(), tm.day);
            __self.assertEquals(0, tm.hour);
            __self.assertEquals(0, tm.minutes);
            __self.assertEquals(0, tm.seconds);
        } ];
        yield [ 'today', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate());

            __self.assertEquals(d.getUTCDate(), tm.day);
            __self.assertEquals(0, tm.hour);
            __self.assertEquals(0, tm.minutes);
            __self.assertEquals(0, tm.seconds);
        } ];
        yield [ 'tomorrow', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() + 1);

            __self.assertEquals(d.getUTCDate(), tm.day);
            __self.assertEquals(0, tm.hour);
            __self.assertEquals(0, tm.minutes);
            __self.assertEquals(0, tm.seconds);
        } ];
        yield [ 'this tuesday', tm => __self.assertEquals(2, tm.weekDay) ];
        yield [ 'next week', tm => __self.assertEquals(1, tm.weekDay) ];
        yield [ 'previous week', tm => __self.assertEquals(1, tm.weekDay) ];
        yield [ 'last year', tm => __self.assertEquals(new Date().getUTCFullYear() - 1, tm._year) ];
        yield [ 'next month', tm => {
            const month = (new Date().getUTCMonth() + 2) % 12;
            __self.assertEquals(0 === month ? 12 : month, tm.month);
        } ];
        yield [ 'yesterday  4:00', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() - 1);

            __self.assertEquals(d.getUTCDate(), tm.day);
            __self.assertEquals(4, tm.hour);
            __self.assertEquals(0, tm.minutes);
        } ];
        yield [ 'last friday at 20:00', tm => {
            __self.assertEquals(5, tm.weekDay);
            __self.assertEquals(20, tm.hour);
            __self.assertEquals(0, tm.minutes);
        } ];

        yield [ '3 years ago', tm => __self.assertEquals(new Date().getUTCFullYear() - 3, tm._year) ];
        yield [ 'in 3 years', tm => __self.assertEquals(new Date().getUTCFullYear() + 3, tm._year) ];
        yield [ '3 days from now', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() + 3);

            __self.assertEquals(d.getUTCDate(), tm.day);
        } ];
        yield [ '3 minutes past 10', tm => {
            __self.assertEquals(9, tm.hour);
            __self.assertEquals(57, tm.minutes);
        } ];
        yield [ '2020-05-01 + 1 week', tm => {
            __self.assertEquals(2020, tm._year);
            __self.assertEquals(5, tm.month);
            __self.assertEquals(8, tm.day);
        } ];
        yield [ '1 month before Europe/Rome 2020-05-01 5pm', tm => {
            __self.assertEquals(2020, tm._year);
            __self.assertEquals(4, tm.month);
            __self.assertEquals(1, tm.day);
            __self.assertEquals(17, tm.hour);
            __self.assertEquals('Europe/Rome', tm.timeZone.name);
        } ];
        yield [ '3 months ago saturday 5:00 pm', tm => {
            const d = new Date();
            d.setMonth(d.getUTCMonth() - 3);
            d.setUTCDate(d.getUTCDate() + (6 - d.getUTCDay()));

            __self.assertEquals(d.getUTCFullYear(), tm._year);
            __self.assertEquals(d.getUTCMonth() + 1, tm.month);
            __self.assertEquals(d.getUTCDate(), tm.day);
            __self.assertEquals(17, tm.hour);
        } ];
        yield [ '3rd wednesday november 2020 10a.m.', tm => {
            __self.assertEquals(2020, tm._year);
            __self.assertEquals(11, tm.month);
            __self.assertEquals(18, tm.day);
            __self.assertEquals(10, tm.hour);
        } ];
        yield [ 'last sunday november 2020 10a.m.', tm => {
            __self.assertEquals(2020, tm._year);
            __self.assertEquals(11, tm.month);
            __self.assertEquals(29, tm.day);
            __self.assertEquals(10, tm.hour);
        } ];
        yield [ 'first wednesday may 2020', tm => {
            __self.assertEquals(2020, tm._year);
            __self.assertEquals(5, tm.month);
            __self.assertEquals(6, tm.day);
        } ];
        yield [ '15 jan 2020 this sun', tm => {
            __self.assertEquals(2020, tm._year);
            __self.assertEquals(1, tm.month);
            __self.assertEquals(19, tm.day);
        } ];
    }

    @dataProvider('provideDateExpressionTests')
    testShouldParseExpressions(date, assertions) {
        const parser = new Parser();
        const tm = parser.parse(date);
        assertions(tm);
    }

    testShouldAccept2400Spec() {
        const parser = new Parser();
        const tm = parser.parse('1916-06-03 24:00');

        __self.assertEquals(0, tm.hour);
        __self.assertEquals(4, tm.day);
    }
}
