const expect = require('chai').expect;

describe('[Exceptions] DomainException', function () {
    it('registered in global namespace', function () {
        return expect(DomainException).to.be.not.undefined;
    });

    it('Is instance of Exception', function () {
        return expect(new DomainException()).to.be.an.instanceof(Exception);
    });
});
