require('../../lib/Error/trigger_deprecated');
const { expect } = require('chai');

describe('Deprecation Trigger', function () {
    it('emits warning', function(done) {
        process.once('warning', warning => {
            expect(warning.message).to.be.equal('FOOBAR is deprecated');
            expect(warning.name).to.be.equal('DeprecationWarning');

            done();
        });

        __jymfony.trigger_deprecated('FOOBAR is deprecated');
    });
});
