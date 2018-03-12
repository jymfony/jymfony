const expect = require('chai').expect;

describe('[Exceptions] LogicException', function () {
    it('registered in global namespace', function () {
        return expect(LogicException).to.be.not.undefined;
    });

    it('Is instance of Exception', function () {
        return expect(new LogicException()).to.be.an.instanceof(Exception);
    });
});
