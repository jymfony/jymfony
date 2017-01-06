let expect = require('chai').expect;
require('../lib/Exception');

class TestException extends Exception {}

describe('[Exceptions] Exception', function () {
    it('registered in global namespace', function () {
        return expect(Exception).to.be.not.undefined;
    });

    it('Is instance of Error', function () {
        return expect(new Exception).to.be.an.instanceof(Error);
    });

    it('Inherits name', function () {
        return expect((new TestException()).name).to.be.equal('TestException');
    });

    it('Captures stack', function () {
        let ex = new Exception;
        return expect(ex.stack).to.be.not.empty;
    });
});
