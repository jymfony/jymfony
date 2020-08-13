const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

const { expect } = require('chai');

describe('[DateTime] DateTime', function () {
    it('should accept string on construction', () => {
        const dt = new DateTime('2017-03-24T00:00:00', 'Etc/UTC');

        expect(dt).to.be.instanceOf(DateTime);
    });

    it('should accept unix timestamp on construction', () => {
        const dt = new DateTime(1490313600, 'Etc/UTC');

        expect(dt).to.be.instanceOf(DateTime);
    });

    it('should accept a js Date object on construction', () => {
        const date = new Date(1490313600000);
        const dt = new DateTime(date, 'Etc/UTC');

        expect(dt).to.be.instanceOf(DateTime);
        expect(dt.year).to.be.equal(2017);
        expect(dt.month).to.be.equal(3);
        expect(dt.day).to.be.equal(24);
        expect(dt.hour).to.be.equal(0);
        expect(dt.minute).to.be.equal(0);
        expect(dt.second).to.be.equal(0);
        expect(dt.millisecond).to.be.equal(0);
    });

    it('today should set time to midnight', () => {
        const dt = DateTime.today;

        expect(dt.hour).to.be.equal(0);
        expect(dt.minute).to.be.equal(0);
        expect(dt.second).to.be.equal(0);
        expect(dt.millisecond).to.be.equal(0);
    });

    it('yesterday should set time to midnight', () => {
        const dt = DateTime.yesterday;

        expect(dt.hour).to.be.equal(0);
        expect(dt.minute).to.be.equal(0);
        expect(dt.second).to.be.equal(0);
        expect(dt.millisecond).to.be.equal(0);
    });

    let tests = [
        [ '2017-01-01T00:00:00', 'P-1D', '2016-12-31T00:00:00+0000' ],
        [ '2016-12-31T00:00:00', 'P+1D', '2017-01-01T00:00:00+0000' ],
        [ '2016-11-30T00:00:00', 'P+1D', '2016-12-01T00:00:00+0000' ],
        [ '2017-01-01T00:00:00', 'P-1Y', '2016-01-01T00:00:00+0000' ],
        [ '2016-02-29T00:00:00', 'P-1Y', '2015-02-28T00:00:00+0000' ],
    ];

    for (const t of tests) {
        it('add timespan should work correctly', () => {
            const [ date, span, expected ] = t;
            let dt = new DateTime(date);
            dt = dt.modify(new TimeSpan(span));

            expect(dt.toString()).to.be.equal(expected);
        });
    }

    it('createFromFormat should correctly parse a date', () => {
        const dt = DateTime.createFromFormat(DateTime.RFC2822, 'Wed, 20 Jun 2018 10:19:32 GMT');
        expect(dt.toString()).to.be.equal('2018-06-20T10:19:32+0000');
    });

    tests = [
        [ '2020 mar 29 01:00 Europe/Rome', 3600, 1, 0 ],
        [ '2020 mar 29 02:00 Europe/Rome', 7200, 3, 0 ],
        [ '2020 mar 29 03:00 Europe/Rome', 7200, 3, 0 ],
        [ '2020 mar 29 04:00 Europe/Rome', 7200, 4, 0 ],
        [ '2020 may 04 02:00 Europe/Rome', 7200, 2, 0 ],
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should correctly handle timezone transitions #'+index, () => {
            const dt = new DateTime(t[0]);

            expect(dt.timezone).to.be.instanceOf(DateTimeZone);
            expect(dt.timezone.getOffset(dt)).to.be.equal(t[1]);
            expect(dt.hour).to.be.equal(t[2]);
            expect(dt.minute).to.be.equal(t[3]);
        });
    }

    it('should correctly handle timezone transitions on modify', () => {
        let dt = new DateTime('2020 mar 29 01:59:59 Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(3600);

        dt = dt.modify(new TimeSpan('PT1S'));

        expect(dt.timezone.name).to.be.equal('Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        expect(dt.hour).to.be.equal(3);
        expect(dt.minute).to.be.equal(0);
    });

    it('should correctly handle between rules', () => {
        let dt = new DateTime('1866 dec 11 00:00 Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(2996);

        dt = new DateTime('1866 dec 11 23:59:59 Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(2996);
        expect(dt.toString()).to.be.equal('1866-12-11T23:59:59+0049');

        dt = dt.modify(new TimeSpan('PT1S'));

        expect(dt.timezone.name).to.be.equal('Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(2996);
        expect(dt.hour).to.be.equal(0);
        expect(dt.minute).to.be.equal(0);

        dt = new DateTime('1893 Oct 31 23:49:55', 'Europe/Rome');

        expect(dt.timezone.name).to.be.equal('Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(2996);
        expect(dt.day).to.be.equal(31);
        expect(dt.hour).to.be.equal(23);
        expect(dt.minute).to.be.equal(49);
        expect(dt.second).to.be.equal(55);

        dt = dt.modify(new TimeSpan('PT1S'));

        expect(dt.timezone.name).to.be.equal('Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(3600);
        expect(dt.hour).to.be.equal(0);
        expect(dt.minute).to.be.equal(0);
        expect(dt.second).to.be.equal(0);

        dt = new DateTime('1916 Jun 3 23:59:59', 'Europe/Rome');

        expect(dt.timezone.name).to.be.equal('Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(3600);
        expect(dt.hour).to.be.equal(23);
        expect(dt.minute).to.be.equal(59);
        expect(dt.second).to.be.equal(59);

        dt = dt.modify(new TimeSpan('PT1S'));

        expect(dt.timezone.name).to.be.equal('Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        expect(dt.month).to.be.equal(6);
        expect(dt.day).to.be.equal(4);
        expect(dt.hour).to.be.equal(1);
        expect(dt.minute).to.be.equal(0);
        expect(dt.second).to.be.equal(0);

        dt = new DateTime('2020 Oct 25 01:59:59', 'Europe/Rome');

        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        expect(dt.hour).to.be.equal(1);
        expect(dt.minute).to.be.equal(59);
        expect(dt.second).to.be.equal(59);

        dt = dt.modify(new TimeSpan('PT1H'));

        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        expect(dt.hour).to.be.equal(2);
        expect(dt.minute).to.be.equal(59);
        expect(dt.second).to.be.equal(59);

        dt = dt.modify(new TimeSpan('PT1S'));

        expect(dt.timezone.getOffset(dt)).to.be.equal(3600);
        expect(dt.hour).to.be.equal(2);
        expect(dt.minute).to.be.equal(0);
        expect(dt.second).to.be.equal(0);

        dt = new DateTime('2020 Oct 25 01:59:59', 'Europe/Rome');

        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        dt = dt.modify(new TimeSpan('P1D'));

        expect(dt.timezone.getOffset(dt)).to.be.equal(3600);
        expect(dt.timestamp).to.be.equal(1603673999);
        expect(dt.hour).to.be.equal(1);
        expect(dt.minute).to.be.equal(59);
        expect(dt.second).to.be.equal(59);

        dt = dt.modify(new TimeSpan('P-1D'));

        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        expect(dt.timestamp).to.be.equal(1603583999);
        expect(dt.hour).to.be.equal(1);
        expect(dt.minute).to.be.equal(59);
        expect(dt.second).to.be.equal(59);

        dt = dt.modify(new TimeSpan('P1M'));

        expect(dt.timezone.getOffset(dt)).to.be.equal(3600);
        expect(dt.timestamp).to.be.equal(1606265999);
        expect(dt.hour).to.be.equal(1);
        expect(dt.minute).to.be.equal(59);
        expect(dt.second).to.be.equal(59);
        expect(dt.day).to.be.equal(25);
        expect(dt.month).to.be.equal(11);
        expect(dt.year).to.be.equal(2020);

        dt = dt.modify(new TimeSpan('P-1M'));

        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        expect(dt.timestamp).to.be.equal(1603583999);

        dt = dt.modify(new TimeSpan('P1Y'));

        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        expect(dt.timestamp).to.be.equal(1635119999);
        expect(dt.hour).to.be.equal(1);
        expect(dt.minute).to.be.equal(59);
        expect(dt.second).to.be.equal(59);
        expect(dt.day).to.be.equal(25);
        expect(dt.month).to.be.equal(10);
        expect(dt.year).to.be.equal(2021);

        dt = dt.modify(new TimeSpan('P7D'));
        expect(dt.timezone.getOffset(dt)).to.be.equal(3600);
        expect(dt.timestamp).to.be.equal(1635728399);

        dt = dt.modify(new TimeSpan('P-1Y7D'));

        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        expect(dt.timestamp).to.be.equal(1603583999);
    });

    it ('invalid times for timezone', () => {
        let dt = new DateTime('1893 Oct 31 23:49:58', 'Europe/Rome');

        expect(dt.timezone.name).to.be.equal('Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(3600);
        expect(dt.year).to.be.equal(1893);
        expect(dt.month).to.be.equal(11);
        expect(dt.day).to.be.equal(1);
        expect(dt.hour).to.be.equal(0);
        expect(dt.minute).to.be.equal(0);
        expect(dt.second).to.be.equal(2);

        dt = new DateTime('2020 mar 29 02:01:00 Europe/Rome');

        expect(dt.timezone.name).to.be.equal('Europe/Rome');
        expect(dt.timezone.getOffset(dt)).to.be.equal(7200);
        expect(dt.hour).to.be.equal(3);
        expect(dt.minute).to.be.equal(1);
    });
});
