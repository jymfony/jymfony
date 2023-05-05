const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class DateTimeTest extends TestCase {
    get testCaseName() {
        return '[DateTime] ' + super.testCaseName;
    }

    testShouldAcceptStringOnConstruction() {
        const dt = new DateTime('2017-03-24T00:00:00', 'Etc/UTC');
        __self.assertInstanceOf(DateTime, dt);
    }

    testShouldAcceptUnixTimestampOnConstruction() {
        const dt = new DateTime(1490313600, 'Etc/UTC');
        __self.assertInstanceOf(DateTime, dt);
    }

    testShouldAcceptAJsDateObjectOnConstruction() {
        const date = new Date(1490313600000);
        const dt = new DateTime(date, 'Etc/UTC');

        __self.assertInstanceOf(DateTime, dt);
        __self.assertEquals(2017, dt.year);
        __self.assertEquals(3, dt.month);
        __self.assertEquals(24, dt.day);
        __self.assertEquals(0, dt.hour);
        __self.assertEquals(0, dt.minute);
        __self.assertEquals(0, dt.second);
        __self.assertEquals(0, dt.millisecond);
    }

    testTodayShouldSetTimeToMidnight() {
        const dt = DateTime.today;

        __self.assertEquals(0, dt.hour);
        __self.assertEquals(0, dt.minute);
        __self.assertEquals(0, dt.second);
        __self.assertEquals(0, dt.millisecond);
    }

    testYesterdayShouldSetTimeToMidnight() {
        const dt = DateTime.yesterday;

        __self.assertEquals(0, dt.hour);
        __self.assertEquals(0, dt.minute);
        __self.assertEquals(0, dt.second);
        __self.assertEquals(0, dt.millisecond);
    }

    * provideTimespanTests() {
        yield [ '2017-01-01T00:00:00', 'P-1D', '2016-12-31T00:00:00+0000' ];
        yield [ '2016-12-31T00:00:00', 'P+1D', '2017-01-01T00:00:00+0000' ];
        yield [ '2016-11-30T00:00:00', 'P+1D', '2016-12-01T00:00:00+0000' ];
        yield [ '2017-01-01T00:00:00', 'P-1Y', '2016-01-01T00:00:00+0000' ];
        yield [ '2016-02-29T00:00:00', 'P-1Y', '2015-02-28T00:00:00+0000' ];
    }

    @dataProvider('provideTimespanTests')
    testAddTimespanShouldWorkCorrectly(date, span, expected) {
        let dt = new DateTime(date);
        dt = dt.modify(new TimeSpan(span));

        __self.assertEquals(expected, dt.toString());
    }

    testCreateFromFormatShouldCorrectlyParseADate() {
        const dt = DateTime.createFromFormat(DateTime.RFC2822, 'Wed, 20 Jun 2018 10:19:32 GMT');
        __self.assertEquals('2018-06-20T10:19:32+0000', dt.toString());
    }

    * provideTimezoneTransitionTests() {
        yield [ '2020 mar 29 01:00 Europe/Rome', 3600, 1, 0 ];
        yield [ '2020 mar 29 02:00 Europe/Rome', 7200, 3, 0 ];
        yield [ '2020 mar 29 03:00 Europe/Rome', 7200, 3, 0 ];
        yield [ '2020 mar 29 04:00 Europe/Rome', 7200, 4, 0 ];
        yield [ '2020 may 04 02:00 Europe/Rome', 7200, 2, 0 ];
    }

    @dataProvider('provideTimezoneTransitionTests')
    testShouldCorrectlyHandleTimezoneTransitions(date, offset, hour, minute) {
        const dt = new DateTime(date);

        __self.assertInstanceOf(DateTimeZone, dt.timezone);
        __self.assertEquals(offset, dt.timezone.getOffset(dt));
        __self.assertEquals(hour, dt.hour);
        __self.assertEquals(minute, dt.minute);
    }

    testShouldCorrectlyHandleTimezoneTransitionsOnModify() {
        let dt = new DateTime('2020 mar 29 01:59:59 Europe/Rome');
        __self.assertEquals(3600, dt.timezone.getOffset(dt));

        dt = dt.modify(new TimeSpan('PT1S'));

        __self.assertEquals('Europe/Rome', dt.timezone.name);
        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        __self.assertEquals(3, dt.hour);
        __self.assertEquals(0, dt.minute);
    }

    testShouldCorrectlyHandleBetweenRules() {
        let dt = new DateTime('1866 dec 11 00:00 Europe/Rome');
        __self.assertEquals(2996, dt.timezone.getOffset(dt));

        dt = new DateTime('1866 dec 11 23:59:59 Europe/Rome');
        __self.assertEquals(2996, dt.timezone.getOffset(dt));
        __self.assertEquals('1866-12-11T23:59:59+0049', dt.toString());

        dt = dt.modify(new TimeSpan('PT1S'));

        __self.assertEquals('Europe/Rome', dt.timezone.name);
        __self.assertEquals(2996, dt.timezone.getOffset(dt));
        __self.assertEquals(0, dt.hour);
        __self.assertEquals(0, dt.minute);

        dt = new DateTime('1893 Oct 31 23:49:55', 'Europe/Rome');

        __self.assertEquals('Europe/Rome', dt.timezone.name);
        __self.assertEquals(2996, dt.timezone.getOffset(dt));
        __self.assertEquals(31, dt.day);
        __self.assertEquals(23, dt.hour);
        __self.assertEquals(49, dt.minute);
        __self.assertEquals(55, dt.second);

        dt = dt.modify(new TimeSpan('PT1S'));

        __self.assertEquals('Europe/Rome', dt.timezone.name);
        __self.assertEquals(3600, dt.timezone.getOffset(dt));
        __self.assertEquals(0, dt.hour);
        __self.assertEquals(0, dt.minute);
        __self.assertEquals(0, dt.second);

        dt = new DateTime('1916 Jun 3 23:59:59', 'Europe/Rome');

        __self.assertEquals('Europe/Rome', dt.timezone.name);
        __self.assertEquals(3600, dt.timezone.getOffset(dt));
        __self.assertEquals(23, dt.hour);
        __self.assertEquals(59, dt.minute);
        __self.assertEquals(59, dt.second);

        dt = dt.modify(new TimeSpan('PT1S'));

        __self.assertEquals('Europe/Rome', dt.timezone.name);
        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        __self.assertEquals(6, dt.month);
        __self.assertEquals(4, dt.day);
        __self.assertEquals(1, dt.hour);
        __self.assertEquals(0, dt.minute);
        __self.assertEquals(0, dt.second);

        dt = new DateTime('2020 Oct 25 01:59:59', 'Europe/Rome');

        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        __self.assertEquals(1, dt.hour);
        __self.assertEquals(59, dt.minute);
        __self.assertEquals(59, dt.second);

        dt = dt.modify(new TimeSpan('PT1H'));

        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        __self.assertEquals(2, dt.hour);
        __self.assertEquals(59, dt.minute);
        __self.assertEquals(59, dt.second);

        dt = dt.modify(new TimeSpan('PT1S'));

        __self.assertEquals(3600, dt.timezone.getOffset(dt));
        __self.assertEquals(2, dt.hour);
        __self.assertEquals(0, dt.minute);
        __self.assertEquals(0, dt.second);

        dt = new DateTime('2020 Oct 25 01:59:59', 'Europe/Rome');

        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        dt = dt.modify(new TimeSpan('P1D'));

        __self.assertEquals(3600, dt.timezone.getOffset(dt));
        __self.assertEquals(1603673999, dt.timestamp);
        __self.assertEquals(1, dt.hour);
        __self.assertEquals(59, dt.minute);
        __self.assertEquals(59, dt.second);

        dt = dt.modify(new TimeSpan('P-1D'));

        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        __self.assertEquals(1603583999, dt.timestamp);
        __self.assertEquals(1, dt.hour);
        __self.assertEquals(59, dt.minute);
        __self.assertEquals(59, dt.second);

        dt = dt.modify(new TimeSpan('P1M'));

        __self.assertEquals(3600, dt.timezone.getOffset(dt));
        __self.assertEquals(1606265999, dt.timestamp);
        __self.assertEquals(1, dt.hour);
        __self.assertEquals(59, dt.minute);
        __self.assertEquals(59, dt.second);
        __self.assertEquals(25, dt.day);
        __self.assertEquals(11, dt.month);
        __self.assertEquals(2020, dt.year);

        dt = dt.modify(new TimeSpan('P-1M'));

        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        __self.assertEquals(1603583999, dt.timestamp);

        dt = dt.modify(new TimeSpan('P1Y'));

        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        __self.assertEquals(1635119999, dt.timestamp);
        __self.assertEquals(1, dt.hour);
        __self.assertEquals(59, dt.minute);
        __self.assertEquals(59, dt.second);
        __self.assertEquals(25, dt.day);
        __self.assertEquals(10, dt.month);
        __self.assertEquals(2021, dt.year);

        dt = dt.modify(new TimeSpan('P7D'));
        __self.assertEquals(3600, dt.timezone.getOffset(dt));
        __self.assertEquals(1635728399, dt.timestamp);

        dt = dt.modify(new TimeSpan('P-1Y7D'));

        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        __self.assertEquals(1603583999, dt.timestamp);
    }

    testInvalidTimesForTimezone() {
        let dt = new DateTime('1893 Oct 31 23:49:58', 'Europe/Rome');

        __self.assertEquals('Europe/Rome', dt.timezone.name);
        __self.assertEquals(3600, dt.timezone.getOffset(dt));
        __self.assertEquals(1893, dt.year);
        __self.assertEquals(11, dt.month);
        __self.assertEquals(1, dt.day);
        __self.assertEquals(0, dt.hour);
        __self.assertEquals(0, dt.minute);
        __self.assertEquals(2, dt.second);

        dt = new DateTime('2020 mar 29 02:01:00 Europe/Rome');

        __self.assertEquals('Europe/Rome', dt.timezone.name);
        __self.assertEquals(7200, dt.timezone.getOffset(dt));
        __self.assertEquals(3, dt.hour);
        __self.assertEquals(1, dt.minute);
    }
}
