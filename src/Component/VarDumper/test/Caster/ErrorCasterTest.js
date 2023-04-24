const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;
const Fixtures = Jymfony.Component.VarDumper.Fixtures;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;
const VarDumperTestTrait = Jymfony.Component.VarDumper.Test.VarDumperTestTrait;

export default class ErrorCasterTest extends mix(TestCase, VarDumperTestTrait) {
    get testCaseName() {
        return '[VarDumper] ' + super.testCaseName;
    }

    getTestError() {
        return new Error();
    }

    testShouldDumpErrorsCorrectly() {
        const dump = `Error {
  message: ""
  code: undefined
  trace: {
    %aErrorCasterTest.js:13 {
      › 
      › getTestError() {
      ›     return new Error();
      › }
      › 
    }
    %aErrorCasterTest.js:31 {…}
%A`;

        this.assertDumpMatchesFormat(dump, this.getTestError());
    }

    testShouldLeaveDumperInManageableState() {
        const cloner = new VarCloner();
        cloner.maxItems = -1;

        const dumper = new CliDumper();
        dumper.colors = false;

        const dump = (data) => {
            data = cloner.cloneVar(data);
            return __jymfony.trim(dumper.dump(data, true));
        };

        dump(this.getTestError());
        __self.assertMatchesRegularExpression(/Date @\d+ {\n  date: .+\n}/, dump(new Date()));
    }

    testShouldCorrectlyDumpAnonymousErrorClasses() {
        const dump = `Error@anonymous {
  message: ""
  code: undefined
  trace: {
    %aErrorCasterFixtures.js:2 {
      › class ErrorCasterFixtures {
      ›     static getAnonymousError() { return new class extends Error{} (); } // eslint-disable-line brace-style
      › }
      › 
    }
    %aErrorCasterTest.js:64 {…}
%A`;

        this.assertDumpMatchesFormat(dump, Fixtures.ErrorCasterFixtures.getAnonymousError());
    }
}
