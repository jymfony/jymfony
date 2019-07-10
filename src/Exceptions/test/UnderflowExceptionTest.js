const { expect } = require('chai');

describe('[Exceptions] UnderflowException', function () {
    it('registered in global namespace', function () {
        return expect(UnderflowException).to.be.not.undefined;
    });

    it('Is instance of Exception', function () {
        return expect(new UnderflowException()).to.be.an.instanceof(Exception);
    });
});
