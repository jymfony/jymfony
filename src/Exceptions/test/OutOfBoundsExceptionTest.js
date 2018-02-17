const expect = require('chai').expect;

describe('[Exceptions] OutOfBoundsException', function () {
    it('registered in global namespace', function () {
        return expect(OutOfBoundsException).to.be.not.undefined;
    });

    it('Is instance of Exception', function () {
        return expect(new OutOfBoundsException()).to.be.an.instanceof(Exception);
    });
});
