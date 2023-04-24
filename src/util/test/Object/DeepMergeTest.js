const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class DeepMergeTest extends TestCase {
    testDeepMergeShouldWork() {
        __self.assertEquals({
            foo: 'bar',
            bar: {
                baz: [ 'barbar', 'foo' ],
                foofoo: 1,
                testbax: 'bax',
                bazbaz: true,
            },
            test: 'foobar',
        }, __jymfony.deepMerge({}, {
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
        }));
    }
}
