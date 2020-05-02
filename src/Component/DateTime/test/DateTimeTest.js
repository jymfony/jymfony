const DateTime = Jymfony.Component.DateTime.DateTime;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;

const { expect } = require('chai');

describe('[DateTime] DateTime', function () {
    // it('should accept string on construction', () => {
    //     const dt = new DateTime('2017-03-24T00:00:00', 'Etc/UTC');
    //
    //     expect(dt).to.be.instanceOf(DateTime);
    // });
    //
    // it('should accept unix timestamp on construction', () => {
    //     const dt = new DateTime(1490313600, 'Etc/UTC');
    //
    //     expect(dt).to.be.instanceOf(DateTime);
    // });
    //
    // it('should accept a js Date object on construction', () => {
    //     const date = new Date(1490313600000);
    //     const dt = new DateTime(date, 'Etc/UTC');
    //
    //     expect(dt).to.be.instanceOf(DateTime);
    //     expect(dt.year).to.be.equal(2017);
    //     expect(dt.month).to.be.equal(3);
    //     expect(dt.day).to.be.equal(24);
    //     expect(dt.hour).to.be.equal(0);
    //     expect(dt.minute).to.be.equal(0);
    //     expect(dt.second).to.be.equal(0);
    //     expect(dt.millisecond).to.be.equal(0);
    // });
    //
    // it('today should set time to midnight', () => {
    //     const dt = DateTime.today;
    //
    //     expect(dt.hour).to.be.equal(0);
    //     expect(dt.minute).to.be.equal(0);
    //     expect(dt.second).to.be.equal(0);
    //     expect(dt.millisecond).to.be.equal(0);
    // });
    //
    // it('yesterday should set time to midnight', () => {
    //     const dt = DateTime.yesterday;
    //
    //     expect(dt.hour).to.be.equal(0);
    //     expect(dt.minute).to.be.equal(0);
    //     expect(dt.second).to.be.equal(0);
    //     expect(dt.millisecond).to.be.equal(0);
    // });
    //
    // const tests = [
    //     [ '2017-01-01T00:00:00', 'P-1D', '2016-12-31T00:00:00+0000' ],
    //     [ '2017-01-01T00:00:00', 'P-1Y', '2016-01-01T00:00:00+0000' ],
    //     [ '2016-02-29T00:00:00', 'P-1Y', '2015-02-28T00:00:00+0000' ],
    // ];
    //
    // for (const t of tests) {
    //     it('add timespan should work correctly', () => {
    //         const [ date, span, expected ] = t;
    //         let dt = new DateTime(date);
    //         dt = dt.modify(new TimeSpan(span));
    //
    //         expect(dt.toString()).to.be.equal(expected);
    //     });
    // }
    //
    // it('createFromFormat should correctly parse a date', () => {
    //     const dt = DateTime.createFromFormat(DateTime.RFC2822, 'Wed, 20 Jun 2018 10:19:32 GMT');
    //     expect(dt.toString()).to.be.equal('2018-06-20T10:19:32+0000');
    // });
});
