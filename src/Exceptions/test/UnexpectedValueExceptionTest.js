const expect = require('chai').expect;

describe('[Exceptions] UnexpectedValueException', function () {
    it('registered in global namespace', function () {
        return expect(UnexpectedValueException).to.be.not.undefined;
    });

    it('Is instance of Exception', function () {
        return expect(new UnexpectedValueException()).to.be.an.instanceof(Exception);
    });
});
