const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;
const { expect } = require('chai');

describe('[VarDumper] VarCloner', function () {
    it('should clone correctly the same object in different cloner instances', () => {
        const o = new class {} ();

        const cloner1 = new VarCloner();
        const cloner2 = new VarCloner();

        expect(cloner1.cloneVar(o)).to.be.deep.equal(cloner2.cloneVar(o));
    });
});
