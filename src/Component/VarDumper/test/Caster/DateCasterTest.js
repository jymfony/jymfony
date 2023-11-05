const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
const DateCaster = Jymfony.Component.VarDumper.Caster.DateCaster;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const VarDumperTestTrait = Jymfony.Component.VarDumper.Test.VarDumperTestTrait;

export default class DateCasterTest extends mix(TestCase, VarDumperTestTrait) {
    get testCaseName() {
        return '[VarDumper] ' + super.testCaseName;
    }

    testShouldDumpDateObjectCorrectly() {
        const dump = `Date @%d {
  date: %a
}`;

        this.assertDumpMatchesFormat(dump, new Date());
    }

    testShouldCastDateObject() {
        const s = new Stub();
        const casted = DateCaster.castDate(new Date(), {}, s);

        this.assertDumpMatchesFormat(`Jymfony.Component.VarDumper.Caster.ConstStub {
  +type: 1
  +class_: "%a"
  +value: "%a"
  +handle: undefined
  +refCount: 0
  +attr: {}
}`, casted['\0~\0date']);
    }

    testShouldCastDatetimeObject() {
        const dump = `Jymfony.Component.DateTime.DateTime @%d {
  date: %a
}`;

        this.assertDumpMatchesFormat(dump, new DateTime());
    }

    testShouldCastTimezoneObject() {
        const dump = `Jymfony.Component.DateTime.DateTimeZone {
  timezone: Europe/Rome
}`;

        this.assertDumpMatchesFormat(dump, DateTimeZone.get('Europe/Rome'));
    }
}
