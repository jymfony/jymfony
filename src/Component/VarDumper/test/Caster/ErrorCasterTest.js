const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;
const CliDumper = Jymfony.Component.VarDumper.Dumper.CliDumper;
const expect = require('chai').expect;

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
    %atest/Caster/ErrorCasterTest.js:8 {
      › 
      › const getTestError = () => {
      ›     return new Error();
      › };
      › 
    }
    %atest/Caster/ErrorCasterTest.js:27 {}
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
});
