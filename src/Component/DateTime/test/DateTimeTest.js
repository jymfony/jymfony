const DateTime = Jymfony.Component.DateTime.DateTime;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

let expect = require('chai').expect;

describe('[DateTime] Parser', function () {
    it('should accept string on construction', () => {
        let dt = new DateTime('2017-03-24T00:00:00', 'Etc/UTC');

        expect(dt).to.be.instanceOf(DateTime);
    });

    it('should accept unix timestamp on construction', () => {
        let dt = new DateTime(1490313600, 'Etc/UTC');

        expect(dt).to.be.instanceOf(DateTime);
    });

    it('today should set time to midnight', () => {
        let dt = DateTime.today;

        expect(dt.hour).to.be.equal(0);
        expect(dt.minute).to.be.equal(0);
        expect(dt.second).to.be.equal(0);
        expect(dt.millisecond).to.be.equal(0);
    });

    it('yesterday should set time to midnight', () => {
        let dt = DateTime.yesterday;

        expect(dt.hour).to.be.equal(0);
        expect(dt.minute).to.be.equal(0);
        expect(dt.second).to.be.equal(0);
        expect(dt.millisecond).to.be.equal(0);
    });

    let tests = [
        ['2017-01-01T00:00:00', 'P-1D', '2016-12-31T00:00:00+0000'],
        ['2017-01-01T00:00:00', 'P-1Y', '2016-01-01T00:00:00+0000'],
        ['2016-02-29T00:00:00', 'P-1Y', '2015-02-28T00:00:00+0000'],
    ];

    for (let t of tests) {
        it('add timespan should work correctly', () => {
            let [date, span, expected] = t;
            let dt = new DateTime(date);
            dt = dt.modify(new TimeSpan(span));

            expect(dt.toString()).to.be.equal(expected);
        });
    }
});
