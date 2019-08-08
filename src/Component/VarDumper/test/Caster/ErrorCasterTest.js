const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;
const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;

require('../../fixtures/namespace');
const Fixtures = Jymfony.Component.VarDumper.Fixtures;

const { expect } = require('chai');

describe('[VarDumper] ErrorCaster', function () {

    const getTestError = () => {
        return new Error();
    };

    it('should dump errors correctly', () => {
        const dump = `
Error {
  message: ""
  code: undefined
  trace: {
    %aErrorCasterTest.js:12 {
      › 
      › const getTestError = () => {
      ›     return new Error();
      › };
      › 
    }
    %aErrorCasterTest.js:31 {…}
%A`;

        expect(getTestError()).to.dumpsAsFormat(dump);
    });

    it('should leave dumper in manageable state', () => {
        const cloner = new VarCloner();
        cloner.maxItems = -1;

        const dumper = new CliDumper();
        dumper.colors = false;

        const dump = (data) => {
            data = cloner.cloneVar(data);
            return __jymfony.trim(dumper.dump(data, true));
        };

        dump(getTestError());
        expect(dump(new Date())).to.match(/Date @\d+ {\n  date: .+\n}/);
    });

    it('should correctly dump anonymous error classes', () => {
        const dump = `
Error@anonymous {
  message: ""
  code: undefined
  trace: {
    %aErrorCasterFixtures.js:2 {
      › class ErrorCasterFixtures {
      ›     static getAnonymousError() { return new class extends Error{} (); } // eslint-disable-line brace-style
      › }
      › 
    }
    %aErrorCasterTest.js:65 {…}
%A`;

        expect(Fixtures.ErrorCasterFixtures.getAnonymousError()).to.dumpsAsFormat(dump);
    });
});
