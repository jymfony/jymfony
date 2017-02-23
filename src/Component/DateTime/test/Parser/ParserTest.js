const Parser = Jymfony.Component.DateTime.Parser.Parser;
const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;

let expect = require('chai').expect;

describe('[DateTime] Parser', function () {
    let tests;

    tests = [
        [ "04:08", "12.45", "19.19", "23:43" ],
        [ "T04:08", "T12.45", "T19.19", "T23:43" ],
        [ "0408", "1245", "1919", "2343" ],
        [ "T0408", "T1245", "T1919", "T2343" ],
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 24-hours time (HH:MM) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t[0]);
            expect(tm.tm_hour).to.be.equal(4);
            expect(tm.tm_min).to.be.equal(8);
            expect(tm.tm_sec).to.be.equal(0);
            expect(tm.tm_msec).to.be.equal(0);

            tm = parser.parse(t[1]);
            expect(tm.tm_hour).to.be.equal(12);
            expect(tm.tm_min).to.be.equal(45);
            expect(tm.tm_sec).to.be.equal(0);
            expect(tm.tm_msec).to.be.equal(0);

            tm = parser.parse(t[2]);
            expect(tm.tm_hour).to.be.equal(19);
            expect(tm.tm_min).to.be.equal(19);
            expect(tm.tm_sec).to.be.equal(0);
            expect(tm.tm_msec).to.be.equal(0);

            tm = parser.parse(t[3]);
            expect(tm.tm_hour).to.be.equal(23);
            expect(tm.tm_min).to.be.equal(43);
            expect(tm.tm_sec).to.be.equal(0);
            expect(tm.tm_msec).to.be.equal(0);
        });
    }

    tests = [
        [ "04:08:37", "12.45.45", "19.19.19", "23:43:57" ],
        [ "T04:08:37", "T12.45.45", "T19.19.19", "T23:43:57" ],
        [ "040837", "124545", "191919", "234357" ],
        [ "T040837", "T124545", "T191919", "T234357" ],
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 24-hours time (HH:MM:II) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t[0]);
            expect(tm.tm_hour).to.be.equal(4);
            expect(tm.tm_min).to.be.equal(8);
            expect(tm.tm_sec).to.be.equal(37);
            expect(tm.tm_msec).to.be.equal(0);

            tm = parser.parse(t[1]);
            expect(tm.tm_hour).to.be.equal(12);
            expect(tm.tm_min).to.be.equal(45);
            expect(tm.tm_sec).to.be.equal(45);
            expect(tm.tm_msec).to.be.equal(0);

            tm = parser.parse(t[2]);
            expect(tm.tm_hour).to.be.equal(19);
            expect(tm.tm_min).to.be.equal(19);
            expect(tm.tm_sec).to.be.equal(19);
            expect(tm.tm_msec).to.be.equal(0);

            tm = parser.parse(t[3]);
            expect(tm.tm_hour).to.be.equal(23);
            expect(tm.tm_min).to.be.equal(43);
            expect(tm.tm_sec).to.be.equal(57);
            expect(tm.tm_msec).to.be.equal(0);
        });
    }

    tests = [
        "4A",
        "4a",
        "4am",
        "4a.m.",
        "4 A",
        "4 a",
        "4 am",
        "4 a.m.",
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 12-hours time (4 am) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_hour).to.be.equal(4);
            expect(tm.tm_min).to.be.equal(0);
            expect(tm.tm_sec).to.be.equal(0);
            expect(tm.tm_msec).to.be.equal(0);
        });
    }

    tests = [
        "4P",
        "4p",
        "4pm",
        "4p.m.",
        "4 P",
        "4 p",
        "4 pm",
        "4 p.m.",
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 12-hours time (4 pm) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_hour).to.be.equal(16);
            expect(tm.tm_min).to.be.equal(0);
            expect(tm.tm_sec).to.be.equal(0);
            expect(tm.tm_msec).to.be.equal(0);
        });
    }

    tests = [
        "4.08A",
        "4:08a",
        "4.08am",
        "4:08a.m.",
        "4.08 A",
        "4:08 a",
        "4.08 am",
        "4:08 a.m.",
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 12-hours time (4.08 am) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_hour).to.be.equal(4);
            expect(tm.tm_min).to.be.equal(8);
            expect(tm.tm_sec).to.be.equal(0);
            expect(tm.tm_msec).to.be.equal(0);
        });
    }

    tests = [
        "4.36P",
        "4:36p",
        "4.36pm",
        "4:36p.m.",
        "4.36 P",
        "4:36 p",
        "4.36 pm",
        "4:36 p.m.",
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 12-hours time (4.36 pm) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_hour).to.be.equal(16);
            expect(tm.tm_min).to.be.equal(36);
            expect(tm.tm_sec).to.be.equal(0);
            expect(tm.tm_msec).to.be.equal(0);
        });
    }

    tests = [
        "4.08.14A",
        "4:08:14a",
        "4.08.14am",
        "4:08:14a.m.",
        "4.08.14 A",
        "4:08:14 a",
        "4.08.14 am",
        "4:08:14 a.m.",
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 12-hours time (4.08.14 am) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_hour).to.be.equal(4);
            expect(tm.tm_min).to.be.equal(8);
            expect(tm.tm_sec).to.be.equal(14);
            expect(tm.tm_msec).to.be.equal(0);
        });
    }

    tests = [
        "4.36.27P",
        "4:36:27p",
        "4.36.27pm",
        "4:36:27p.m.",
        "4.36.27 P",
        "4:36:27 p",
        "4.36.27 pm",
        "4:36:27 p.m.",
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 12-hours time (4.36.27 pm) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_hour).to.be.equal(16);
            expect(tm.tm_min).to.be.equal(36);
            expect(tm.tm_sec).to.be.equal(27);
            expect(tm.tm_msec).to.be.equal(0);
        });
    }

    tests = [
        "4:08:14:34567A",
        "4:08:14:3456a",
        "4:08:14:345670am",
        "4:08:14:345a.m.",
        "4:08:14:34567 A",
        "4:08:14:3456 a",
        "4:08:14:345670 am",
        "4:08:14:345 a.m.",
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 12-hours time (4.08.14.345 am) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_hour).to.be.equal(4);
            expect(tm.tm_min).to.be.equal(8);
            expect(tm.tm_sec).to.be.equal(14);
            expect(tm.tm_msec).to.be.equal(345);
        });
    }

    tests = [
        "4:36:27:34567P",
        "4:36:27:3456p",
        "4:36:27:345670pm",
        "4:36:27:345p.m.",
        "4:36:27:34567 P",
        "4:36:27:3456 p",
        "4:36:27:345670 pm",
        "4:36:27:345 p.m.",
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly 12-hours time (4.36.27.345 pm) #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_hour).to.be.equal(16);
            expect(tm.tm_min).to.be.equal(36);
            expect(tm.tm_sec).to.be.equal(27);
            expect(tm.tm_msec).to.be.equal(345);
        });
    }

    tests = [
        "GMT",
        "CEST",
        "Europe/Rome",
        "GMT+0700",
        "GMT-04:00",
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly tz #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_tz).to.be.instanceOf(DateTimeZone);
            expect(tm.tm_tz.name).to.be.equal(t);
        });
    }

    tests = [
        '2017-03-09',
        '2017/03/09',
        '20170309',
        '17-03-09',
        '@1489017600',
        '+2017-03-09',
    ];

    for (let index of tests.keys()) {
        let t = tests[index];
        it('should parse correctly date #'+index, () => {
            let tm, parser = new Parser();

            tm = parser.parse(t);
            expect(tm.tm_hour).to.be.equal(0);
            expect(tm.tm_min).to.be.equal(0);
            expect(tm.tm_sec).to.be.equal(0);
            expect(tm.tm_msec).to.be.equal(0);
            expect(tm.tm_year).to.be.equal(2017);
            expect(tm.tm_mon).to.be.equal(3);
            expect(tm.tm_mday).to.be.equal(9);
        });
    }

    it('should return correct computed datas', () => {
        let tm, parser = new Parser();

        tm = parser.parse('2017-03-09', 'Etc/UTC');
        expect(tm.tm_wday).to.be.equal(4);
        expect(tm.tm_yday).to.be.equal(68);
        expect(tm.tm_week).to.be.equal(10);
        expect(tm.tm_leap).to.be.equal(false);
        expect(tm.days_from_epoch).to.be.equal(17234);
        expect(tm.unix_timestamp).to.be.equal(1489017600);
    });
});
