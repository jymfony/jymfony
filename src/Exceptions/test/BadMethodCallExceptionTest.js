let expect = require('chai').expect;
require('../lib/BadMethodCallException');

describe('[Exceptions] BadMethodCallException', function () {
    it('registered in global namespace', function () {
        return expect(BadMethodCallException).to.be.not.undefined;
    });

    it('Is instance of Exception', function () {
        return expect(new BadMethodCallException).to.be.an.instanceof(Exception);
    });
});
