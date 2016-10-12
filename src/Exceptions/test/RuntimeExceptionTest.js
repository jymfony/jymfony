let expect = require('chai').expect;
require('../lib/RuntimeException');

describe('Exception', function () {
    it('registered in global namespace', function () {
        return expect(RuntimeException).to.be.not.undefined;
    });

    it('Is instance of Exception', function () {
        return expect(new RuntimeException).to.be.an.instanceof(Exception);
    });
});
