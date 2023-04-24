const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const VarDumperTestTrait = Jymfony.Component.VarDumper.Test.VarDumperTestTrait;

export default class RegExpCasterTest extends mix(TestCase, VarDumperTestTrait) {
    get testCaseName() {
        return '[VarDumper] ' + super.testCaseName;
    }

    testShouldDumpRegexpObjectCorrectly() {
        const dump = `RegExp {
  source: 23
  flags: gi
}`;

        this.assertDumpMatchesFormat(dump, /23/gi);
        this.assertDumpMatchesFormat(dump, new RegExp('23', 'gi'));
    }
}
