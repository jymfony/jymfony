const Parser = Jymfony.Component.DateTime.Parser.Parser;
const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;

const { expect } = require('chai');

describe('[DateTime] Parser', function () {
    let tests;

    tests = [
        [ '04:08', '12.45', '19.19', '23:43' ],
        [ 'T04:08', 'T12.45', 'T19.19', 'T23:43' ],
        [ '0408', '1245', '1919', '2343' ],
        [ 'T0408', 'T1245', 'T1919', 'T2343' ],
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 24-hours time (HH:MM) #'+index, () => {
            let tm;
            const parser = new Parser();

            tm = parser.parse(t[0]);
            expect(tm.hour).to.be.equal(4);
            expect(tm.minutes).to.be.equal(8);
            expect(tm.seconds).to.be.equal(0);
            expect(tm.milliseconds).to.be.equal(0);

            tm = parser.parse(t[1]);
            expect(tm.hour).to.be.equal(12);
            expect(tm.minutes).to.be.equal(45);
            expect(tm.seconds).to.be.equal(0);
            expect(tm.milliseconds).to.be.equal(0);

            tm = parser.parse(t[2]);
            expect(tm.hour).to.be.equal(19);
            expect(tm.minutes).to.be.equal(19);
            expect(tm.seconds).to.be.equal(0);
            expect(tm.milliseconds).to.be.equal(0);

            tm = parser.parse(t[3]);
            expect(tm.hour).to.be.equal(23);
            expect(tm.minutes).to.be.equal(43);
            expect(tm.seconds).to.be.equal(0);
            expect(tm.milliseconds).to.be.equal(0);
        });
    }

    tests = [
        [ '04:08:37', '12.45.45', '19.19.19', '23:43:57' ],
        [ 'T04:08:37', 'T12.45.45', 'T19.19.19', 'T23:43:57' ],
        [ '040837', '124545', '191919', '234357' ],
        [ 'T040837', 'T124545', 'T191919', 'T234357' ],
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 24-hours time (HH:MM:II) #'+index, () => {
            let tm;
            const parser = new Parser();

            tm = parser.parse(t[0]);
            expect(tm.hour).to.be.equal(4);
            expect(tm.minutes).to.be.equal(8);
            expect(tm.seconds).to.be.equal(37);
            expect(tm.milliseconds).to.be.equal(0);

            tm = parser.parse(t[1]);
            expect(tm.hour).to.be.equal(12);
            expect(tm.minutes).to.be.equal(45);
            expect(tm.seconds).to.be.equal(45);
            expect(tm.milliseconds).to.be.equal(0);

            tm = parser.parse(t[2]);
            expect(tm.hour).to.be.equal(19);
            expect(tm.minutes).to.be.equal(19);
            expect(tm.seconds).to.be.equal(19);
            expect(tm.milliseconds).to.be.equal(0);

            tm = parser.parse(t[3]);
            expect(tm.hour).to.be.equal(23);
            expect(tm.minutes).to.be.equal(43);
            expect(tm.seconds).to.be.equal(57);
            expect(tm.milliseconds).to.be.equal(0);
        });
    }

    tests = [
        '4A',
        '4a',
        '4am',
        '4a.m.',
        '4 A',
        '4 a',
        '4 am',
        '4 a.m.',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 12-hours time (4 am) #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.hour).to.be.equal(4);
            expect(tm.minutes).to.be.equal(0);
            expect(tm.seconds).to.be.equal(0);
            expect(tm.milliseconds).to.be.equal(0);
        });
    }

    tests = [
        '4P',
        '4p',
        '4pm',
        '4p.m.',
        '4 P',
        '4 p',
        '4 pm',
        '4 p.m.',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 12-hours time (4 pm) #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.hour).to.be.equal(16);
            expect(tm.minutes).to.be.equal(0);
            expect(tm.seconds).to.be.equal(0);
            expect(tm.milliseconds).to.be.equal(0);
        });
    }

    tests = [
        '4.08A',
        '4:08a',
        '4.08am',
        '4:08a.m.',
        '4.08 A',
        '4:08 a',
        '4.08 am',
        '4:08 a.m.',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 12-hours time (4.08 am) #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.hour).to.be.equal(4);
            expect(tm.minutes).to.be.equal(8);
            expect(tm.seconds).to.be.equal(0);
            expect(tm.milliseconds).to.be.equal(0);
        });
    }

    tests = [
        '4.36P',
        '4:36p',
        '4.36pm',
        '4:36p.m.',
        '4.36 P',
        '4:36 p',
        '4.36 pm',
        '4:36 p.m.',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 12-hours time (4.36 pm) #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.hour).to.be.equal(16);
            expect(tm.minutes).to.be.equal(36);
            expect(tm.seconds).to.be.equal(0);
            expect(tm.milliseconds).to.be.equal(0);
        });
    }

    tests = [
        '4.08.14A',
        '4:08:14a',
        '4.08.14am',
        '4:08:14a.m.',
        '4.08.14 A',
        '4:08:14 a',
        '4.08.14 am',
        '4:08:14 a.m.',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 12-hours time (4.08.14 am) #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.hour).to.be.equal(4);
            expect(tm.minutes).to.be.equal(8);
            expect(tm.seconds).to.be.equal(14);
            expect(tm.milliseconds).to.be.equal(0);
        });
    }

    tests = [
        '4.36.27P',
        '4:36:27p',
        '4.36.27pm',
        '4:36:27p.m.',
        '4.36.27 P',
        '4:36:27 p',
        '4.36.27 pm',
        '4:36:27 p.m.',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 12-hours time (4.36.27 pm) #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.hour).to.be.equal(16);
            expect(tm.minutes).to.be.equal(36);
            expect(tm.seconds).to.be.equal(27);
            expect(tm.milliseconds).to.be.equal(0);
        });
    }

    tests = [
        '4:08:14:34567A',
        '4:08:14:3456a',
        '4:08:14:345670am',
        '4:08:14:345a.m.',
        '4:08:14:34567 A',
        '4:08:14:3456 a',
        '4:08:14:345670 am',
        '4:08:14:345 a.m.',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 12-hours time (4.08.14.345 am) #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.hour).to.be.equal(4);
            expect(tm.minutes).to.be.equal(8);
            expect(tm.seconds).to.be.equal(14);
            expect(tm.milliseconds).to.be.equal(345);
        });
    }

    tests = [
        '4:36:27:34567P',
        '4:36:27:3456p',
        '4:36:27:345670pm',
        '4:36:27:345p.m.',
        '4:36:27:34567 P',
        '4:36:27:3456 p',
        '4:36:27:345670 pm',
        '4:36:27:345 p.m.',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly 12-hours time (4.36.27.345 pm) #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.hour).to.be.equal(16);
            expect(tm.minutes).to.be.equal(36);
            expect(tm.seconds).to.be.equal(27);
            expect(tm.milliseconds).to.be.equal(345);
        });
    }

    tests = [
        'GMT',
        'CEST',
        'Europe/Rome',
        'GMT+0700',
        'GMT-04:00',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly tz #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.timeZone).to.be.instanceOf(DateTimeZone);
            expect(tm.timeZone.name).to.be.equal(t);
        });
    }

    tests = [
        '2017-03-09',
        '2017/03/09',
        '20170309',
        '17-03-09',
        '@1489017600',
        '+2017-03-09',
        '2017-03-09T00:00:00+0000',
        '2017-03-09T00:00:00Z',
        '2017 Mar 09  0:00',
        '09 Mar 2017 00:00',
        'mar 09 2017 00:00',
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse correctly date #'+index, () => {
            const parser = new Parser();

            const tm = parser.parse(t);
            expect(tm.hour).to.be.equal(0);
            expect(tm.minutes).to.be.equal(0);
            expect(tm.seconds).to.be.equal(0);
            expect(tm.milliseconds).to.be.equal(0);
            expect(tm._year).to.be.equal(2017);
            expect(tm.month).to.be.equal(3);
            expect(tm.day).to.be.equal(9);
        });
    }

    it('should return correct computed dates', () => {
        const parser = new Parser();

        const tm = parser.parse('2017-03-09', 'Etc/UTC');
        expect(tm.weekDay).to.be.equal(4);
        expect(tm.yearDay).to.be.equal(68);
        expect(tm.isoWeekNumber).to.be.equal(10);
        expect(tm.leap).to.be.equal(false);
        expect(tm.daysFromEpoch).to.be.equal(17234);
        expect(tm.unixTimestamp).to.be.equal(1489017600);
    });

    it('should parse "now"', () => {
        const parser = new Parser();

        const currentDate = new Date();
        const tm = parser.parse('now');
        expect(tm._year).to.be.equal(currentDate.getUTCFullYear());
    });

    tests = [
        [ 'thursday', tm => expect(tm.weekDay).to.be.equal(4) ],
        [ 'november', tm => expect(tm.month).to.be.equal(11) ],
        [ 'january', tm => expect(tm.month).to.be.equal(1) ],
        [ 'friday 13:00', tm => {
            expect(tm.weekDay).to.be.equal(5);
            expect(tm.hour).to.be.equal(13);
            expect(tm.minutes).to.be.equal(0);
            expect(tm.seconds).to.be.equal(0);
        } ],
        [ 'mon 02.35', tm => {
            expect(tm.weekDay).to.be.equal(1);
            expect(tm.hour).to.be.equal(2);
            expect(tm.minutes).to.be.equal(35);
            expect(tm.seconds).to.be.equal(0);
        } ],
        [ 'mon 2.35am', tm => {
            expect(tm.weekDay).to.be.equal(1);
            expect(tm.hour).to.be.equal(2);
            expect(tm.minutes).to.be.equal(35);
            expect(tm.seconds).to.be.equal(0);
        } ],
        [ '6 in the morning', tm => {
            expect(tm.hour).to.be.equal(6);
            expect(tm.minutes).to.be.equal(0);
            expect(tm.seconds).to.be.equal(0);
        } ],
        [ 'sat 7 in the evening', tm => {
            expect(tm.weekDay).to.be.equal(6);
            expect(tm.hour).to.be.equal(19);
            expect(tm.minutes).to.be.equal(0);
            expect(tm.seconds).to.be.equal(0);
        } ],
        [ 'yesterday', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() - 1);

            expect(tm.day).to.be.equal(d.getUTCDate());
            expect(tm.hour).to.be.equal(0);
            expect(tm.minutes).to.be.equal(0);
            expect(tm.seconds).to.be.equal(0);
        } ],
        [ 'today', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate());

            expect(tm.day).to.be.equal(d.getUTCDate());
            expect(tm.hour).to.be.equal(0);
            expect(tm.minutes).to.be.equal(0);
            expect(tm.seconds).to.be.equal(0);
        } ],
        [ 'tomorrow', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() + 1);

            expect(tm.day).to.be.equal(d.getUTCDate());
            expect(tm.hour).to.be.equal(0);
            expect(tm.minutes).to.be.equal(0);
            expect(tm.seconds).to.be.equal(0);
        } ],
        [ 'this tuesday', tm => expect(tm.weekDay).to.be.equal(2) ],
        [ 'next week', tm => expect(tm.weekDay).to.be.equal(1) ],
        [ 'previous week', tm => expect(tm.weekDay).to.be.equal(1) ],
        [ 'last year', tm => expect(tm._year).to.be.equal(new Date().getUTCFullYear() - 1) ],
        [ 'next month', tm => {
            const month = (new Date().getUTCMonth() + 2) % 12;
            expect(tm.month).to.be.equal(0 === month ? 12 : month);
        } ],
        [ 'yesterday  4:00', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() - 1);

            expect(tm.day).to.be.equal(d.getUTCDate());
            expect(tm.hour).to.be.equal(4);
            expect(tm.minutes).to.be.equal(0);
        } ],
        [ 'last friday at 20:00', tm => {
            expect(tm.weekDay).to.be.equal(5);
            expect(tm.hour).to.be.equal(20);
            expect(tm.minutes).to.be.equal(0);
        } ],
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse simple expressions #'+index+': "'+t[0]+'"', () => {
            const parser = new Parser();
            const tm = parser.parse(t[0]);
            t[1](tm);
        });
    }

    tests = [
        [ '3 years ago', tm => expect(tm._year).to.be.equal(new Date().getUTCFullYear() - 3) ],
        [ 'in 3 years', tm => expect(tm._year).to.be.equal(new Date().getUTCFullYear() + 3) ],
        [ '3 days from now', tm => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() + 3);

            expect(tm.day).to.be.equal(d.getUTCDate());
        } ],
        [ '3 minutes past 10', tm => {
            expect(tm.hour).to.be.equal(9);
            expect(tm.minutes).to.be.equal(57);
        } ],
        [ '2020-05-01 + 1 week', tm => {
            expect(tm._year).to.be.equal(2020);
            expect(tm.month).to.be.equal(5);
            expect(tm.day).to.be.equal(8);
        } ],
        [ '1 month before Europe/Rome 2020-05-01 5pm', tm => {
            expect(tm._year).to.be.equal(2020);
            expect(tm.month).to.be.equal(4);
            expect(tm.day).to.be.equal(1);
            expect(tm.hour).to.be.equal(17);
            expect(tm.timeZone.name).to.be.equal('Europe/Rome');
        } ],
        [ '3 months ago saturday 5:00 pm', tm => {
            const d = new Date();
            d.setMonth(d.getUTCMonth() - 3);
            d.setUTCDate(d.getUTCDate() + (6 - d.getUTCDay()));

            expect(tm._year).to.be.equal(d.getUTCFullYear());
            expect(tm.month).to.be.equal(d.getUTCMonth() + 1);
            expect(tm.day).to.be.equal(d.getUTCDate());
            expect(tm.hour).to.be.equal(17);
        } ],
        [ '3rd wednesday november 2020 10a.m.', tm => {
            expect(tm._year).to.be.equal(2020);
            expect(tm.month).to.be.equal(11);
            expect(tm.day).to.be.equal(18);
            expect(tm.hour).to.be.equal(10);
        } ],
        [ 'last sunday november 2020 10a.m.', tm => {
            expect(tm._year).to.be.equal(2020);
            expect(tm.month).to.be.equal(11);
            expect(tm.day).to.be.equal(29);
            expect(tm.hour).to.be.equal(10);
        } ],
        [ 'first wednesday may 2020', tm => {
            expect(tm._year).to.be.equal(2020);
            expect(tm.month).to.be.equal(5);
            expect(tm.day).to.be.equal(6);
        } ],
        [ '15 jan 2020 this sun', tm => {
            expect(tm._year).to.be.equal(2020);
            expect(tm.month).to.be.equal(1);
            expect(tm.day).to.be.equal(19);
        } ],
    ];

    for (const index of tests.keys()) {
        const t = tests[index];
        it('should parse complex expressions #'+index+': "'+t[0]+'"', () => {
            const parser = new Parser();
            const tm = parser.parse(t[0]);
            t[1](tm);
        });
    }

    it ('should accept 24:00 spec', () => {
        const parser = new Parser();
        const tm = parser.parse('1916-06-03 24:00');

        expect(tm.hour).to.be.equal(0);
        expect(tm.day).to.be.equal(4);
    });
});
