require('../../lib/Object/deepMerge');
const { expect } = require('chai');

describe('Deep Merge', function () {
    it('deepMerge should work', () => {
        expect(
            __jymfony.deepMerge({}, {
                foo: 'bar',
                bar: {
                    baz: [ 'foobar', 'foo' ],
                    foofoo: { test: 'test' },
                    testbax: 'bax',
                },
            }, {
                bar: {
                    baz: [ 'barbar' ],
                    foofoo: 1,
                    bazbaz: true,
                },
                test: 'foobar',
            })
        ).to.be.deep.equal({
            foo: 'bar',
            bar: {
                baz: [ 'barbar', 'foo' ],
                foofoo: 1,
                testbax: 'bax',
                bazbaz: true,
            },
            test: 'foobar',
        });
    });
});
