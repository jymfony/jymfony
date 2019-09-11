const { expect } = require('chai');

describe('[Exceptions] InvalidArgumentException', function () {
    it('registered in global namespace', function () {
        return expect(InvalidArgumentException).to.be.not.undefined;
    });

    it('Is instance of Exception', function () {
        return expect(new InvalidArgumentException()).to.be.an.instanceof(Exception);
    });
});
