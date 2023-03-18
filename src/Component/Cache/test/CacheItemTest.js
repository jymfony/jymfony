const CacheItem = Jymfony.Component.Cache.CacheItem;
const InvalidArgumentException = Jymfony.Contracts.Cache.Exception.InvalidArgumentException;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class CacheItemTest extends TestCase {
    get testCaseName() {
        return '[Cache] ' + super.testCaseName;
    }

    testShouldAcceptValidKeys() {
        // TODO: assert no exception is thrown
        CacheItem.validateKey('foo');
    }

    * provideInvalidKey() {
        yield [ '' ];
        yield [ '{' ];
        yield [ '}' ];
        yield [ '(' ];
        yield [ ')' ];
        yield [ '/' ];
        yield [ '\\' ];
        yield [ '@' ];
        yield [ ':' ];
        yield [ true ];
        yield [ null ];
        yield [ 1 ];
        yield [ 1.1 ];
        yield [ [ [] ] ];
        yield [ new Exception('foo') ];
    };

    @dataProvider('provideInvalidKey')
    testShouldThrowOnInvalidKey(key) {
        this.expectException(InvalidArgumentException);
        CacheItem.validateKey(key);
    }

    testTagShouldWork() {
        const item = new CacheItem();
        item._isTaggable = true;

        __self.assertSame(item, item.tag('foo'));
        __self.assertSame(item, item.tag([ 'bar', 'baz' ]));
        __self.assertSame(item, item.tag([ 'foo' ]));

        __self.assertEquals([ 'foo', 'bar', 'baz' ], item._tags);
    }

    @dataProvider('provideInvalidKey')
    testShouldThrowOnInvalidTag(key) {
        this.expectException(InvalidArgumentException);

        const item = new CacheItem();
        item._isTaggable = true;
        item.tag(key);
    }
}
