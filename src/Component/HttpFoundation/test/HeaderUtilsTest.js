const HeaderUtils = Jymfony.Component.HttpFoundation.HeaderUtils;
const expect = require('chai').expect;

describe('[HttpFoundation] HeaderUtils', function () {
    it('split', () => {
        expect(HeaderUtils.split('foo=123, bar; foo=456', ',;='))
            .to.be.deep.equal([ [ [ 'foo', '123' ] ], [ [ 'bar' ], [ 'foo', '456' ] ] ]);
    });
});
