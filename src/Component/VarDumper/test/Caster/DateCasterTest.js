const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
const DateCaster = Jymfony.Component.VarDumper.Caster.DateCaster;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;
const { expect } = require('chai');

describe('[VarDumper] DateCaster', function () {
    it('should dump date object correctly', () => {
        const dump = `
Date @%d {
  date: %a
}`;

        expect(new Date()).to.dumpsAsFormat(dump);
    });

    it('should cast date object', function () {
        const s = new Stub();
        const casted = DateCaster.castDate(new Date(), {}, s);

        expect(casted['\0~\0date']).to.dumpsAsFormat(`
Jymfony.Component.VarDumper.Caster.ConstStub {
  +type: 1
  +class_: "%a"
  +value: "%a"
  +handle: undefined
  +refCount: 0
  +attr: {}
}`);
    });

    it('should cast datetime object', () => {
        const dump = `
Jymfony.Component.DateTime.DateTime @%d {
  date: %a
}`;

        expect(new DateTime()).to.dumpsAsFormat(dump);
    });

    it('should cast datetime object', function () {
        const s = new Stub();
        const casted = DateCaster.castDate(new Date(), {}, s);

        expect(casted['\0~\0date']).to.dumpsAsFormat(`
Jymfony.Component.VarDumper.Caster.ConstStub {
  +type: 1
  +class_: "%a"
  +value: "%a"
  +handle: undefined
  +refCount: 0
  +attr: {}
}`);
    });

    it('should cast timezone object', () => {
        const dump = `
Jymfony.Component.DateTime.DateTimeZone {
  timezone: Europe/Rome
}`;

        expect(DateTimeZone.get('Europe/Rome')).to.dumpsAsFormat(dump);
    });
});
