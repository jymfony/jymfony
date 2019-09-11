const CacheItem = Jymfony.Component.Cache.CacheItem;
const InvalidArgumentException = Jymfony.Component.Cache.Exception.InvalidArgumentException;

const { expect } = require('chai');

describe('[Cache] CacheItem', function () {
    it('should accept valid key', () => {
        CacheItem.validateKey('foo');
        expect(true).to.be.true;
    });

    const provideInvalidKey = function * () {
        yield '';
        yield '{';
        yield '}';
        yield '(';
        yield ')';
        yield '/';
        yield '\\';
        yield '@';
        yield ':';
        yield true;
        yield null;
        yield 1;
        yield 1.1;
        yield [ [] ];
        yield new Exception('foo');
    };

    let index = 0;
    for (const key of provideInvalidKey()) {
        it('should throw on invalid key with dataset #' + index++, () => {
            expect(() => {
                CacheItem.validateKey(key);
            }).to.throw(InvalidArgumentException);
        });
    }

    it('tag sould work', () => {
        const item = new CacheItem();

        expect(item.tag('foo')).to.be.equal(item);
        expect(item.tag([ 'bar', 'baz' ])).to.be.equal(item);
        expect(item.tag([ 'foo' ])).to.be.equal(item);

        expect(item._tags).to.be.deep.equal([ 'foo', 'bar', 'baz' ]);
    });

    index = 0;
    for (const key of provideInvalidKey()) {
        it('should throw on invalid tag with dataset #' + index++, () => {
            expect(() => {
                const item = new CacheItem();
                item.tag(key);
            }).to.throw(InvalidArgumentException);
        });
    }
});
