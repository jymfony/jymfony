const InvalidArgumentException = Jymfony.Component.Cache.Exception.InvalidArgumentException;
const PruneableInterface = Jymfony.Component.Cache.PruneableInterface;
const NotUnserializable = Jymfony.Component.Cache.Fixtures.NotUnserializable;
const DateTime = Jymfony.Component.DateTime.DateTime;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;
const { expect } = require('chai');

/**
 * Data provider for invalid keys.
 */
function * invalidKeys() {
    yield true;
    yield false;
    yield null;
    yield 2;
    yield 2.5;
    yield '{str';
    yield 'rand{';
    yield 'rand{str';
    yield 'rand}str';
    yield 'rand(str';
    yield 'rand)str';
    yield 'rand/str';
    yield 'rand\\str';
    yield 'rand@str';
    yield 'rand:str';
    yield {};
    yield [ 'array' ];
}

exports.shouldPassAdapterTests = function () {
    this.timeout(60000);
    this._skippedTests = this._skippedTests || {};

    before(() => {
        const pool = this._createCachePool();
        if (! (pool instanceof PruneableInterface)) {
            this.testPrune = undefined;
        }
    });

    beforeEach(() => {
        this._cache = this._createCachePool();
    });

    afterEach(async () => {
        if (this._cache) {
            await this._cache.clear();
        }
    });

    this.testBasicUsage = async () => {
        let item = await this._cache.getItem('key');
        item.set('4711');
        await this._cache.save(item);

        item = await this._cache.getItem('key2');
        item.set('4712');
        await this._cache.save(item);

        const fooItem = await this._cache.getItem('key');
        expect(fooItem.isHit).to.be.true;
        expect(fooItem.get()).to.be.equal('4711');

        const barItem = await this._cache.getItem('key2');
        expect(barItem.isHit).to.be.true;
        expect(barItem.get()).to.be.equal('4712');

        await this._cache.deleteItem('key');
        expect((await this._cache.getItem('key')).isHit).to.be.false;
        expect((await this._cache.getItem('key2')).isHit).to.be.true;

        await this._cache.deleteItem('key2');
        expect((await this._cache.getItem('key')).isHit).to.be.false;
        expect((await this._cache.getItem('key2')).isHit).to.be.false;
    };

    this.testBasicUsageWithLongKeys = async () => {
        const key = 'a'.repeat(300);

        let item = await this._cache.getItem(key);
        expect(item.isHit).to.be.false;
        expect(item.key).to.be.equal(key);
        item.set('value');
        expect(await this._cache.save(item)).to.be.true;

        item = await this._cache.getItem(key);
        expect(item.isHit).to.be.true;
        expect(item.key).to.be.equal(key);
        expect(item.get()).to.be.equal('value');

        expect(await this._cache.deleteItem(key)).to.be.true;

        item = await this._cache.getItem(key);
        expect(item.isHit).to.be.false;
    };

    this.testItemModifiersReturnsSelf = async () => {
        const item = await this._cache.getItem('key');

        expect(item.set('4711')).to.be.equal(item);
        expect(item.expiresAfter(2)).to.be.equal(item);
        expect(item.expiresAt(DateTime.now.modify(new TimeSpan('PT2H')))).to.be.equal(item);
    };

    this.testGetItem = async () => {
        let item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        item = await this._cache.getItem('key');
        expect(item.isHit).to.be.true;
        expect(item.key).to.be.equal('key');
        expect(item.get()).to.be.equal('value');

        item = await this._cache.getItem('key2');
        expect(item.isHit).to.be.false;
        expect(item.get()).to.be.undefined;
    };

    this.testGetItems = async () => {
        const keys = [ 'foo', 'bar', 'baz' ];
        let items = await this._cache.getItems(keys);

        for (const [ k, item ] of items.entries()) {
            item.set(k);
            await this._cache.save(item);
        }

        expect(items.size).to.be.equal(3);

        keys.push('biz');
        items = await this._cache.getItems(keys);
        let count = 0;
        for (const [ key, item ] of items.entries()) {
            const itemKey = item.key;

            expect(itemKey).to.be.equal(key);
            expect(item.isHit).to.be.equal('biz' !== key);
            expect(item.get()).to.be.equal('biz' !== key ? key : undefined);
            expect(keys.indexOf(key)).not.to.be.equal(-1);

            count++;
        }

        expect(count).to.be.equal(4);

        items = await this._cache.getItems([]);
        expect(items).to.be.instanceOf(Map);
        expect(items.size).to.be.equal(0);
    };

    this.testHasItem = async () => {
        const item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        expect(await this._cache.hasItem('key')).to.be.true;
        expect(await this._cache.hasItem('key2')).to.be.false;
    };

    this.testClear = async () => {
        const item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        expect(await this._cache.clear()).to.be.true;
        expect((await this._cache.getItem('key')).isHit).to.be.false;
        expect(await this._cache.hasItem('key2')).to.be.false;
    };

    this.testDeleteItem = async () => {
        const item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        expect(await this._cache.deleteItem('key')).to.be.true;
        expect((await this._cache.getItem('key')).isHit).to.be.false;
        expect(await this._cache.hasItem('key')).to.be.false;

        // Requesting deletion of non-existent key should return true
        expect(await this._cache.deleteItem('key2')).to.be.true;
    };

    this.testDeleteItems = async () => {
        const keys = [ 'foo', 'bar', 'baz' ];
        const items = await this._cache.getItems(keys);

        for (const [ k, item ] of items.entries()) {
            item.set(k);
            await this._cache.save(item);
        }

        expect(await this._cache.hasItem('foo')).to.be.true;
        expect(await this._cache.hasItem('bar')).to.be.true;
        expect(await this._cache.hasItem('baz')).to.be.true;
        expect(await this._cache.hasItem('biz')).to.be.false;

        await this._cache.deleteItems(keys);

        expect(await this._cache.hasItem('foo')).to.be.false;
        expect(await this._cache.hasItem('bar')).to.be.false;
        expect(await this._cache.hasItem('baz')).to.be.false;
        expect(await this._cache.hasItem('biz')).to.be.false;
    };

    this.testSave = async () => {
        const item = await this._cache.getItem('key');
        item.set('value');

        expect(await this._cache.save(item)).to.be.true;
        expect((await this._cache.getItem('key')).get()).to.be.equal('value');
    };

    this.testSaveExpired = async () => {
        const item = await this._cache.getItem('key');
        item.set('value');
        item.expiresAt(new DateTime(DateTime.unixTime + 10));
        expect(await this._cache.save(item)).to.be.true;
        item.expiresAt(new DateTime(DateTime.unixTime -1));
        await this._cache.save(item);

        expect(await this._cache.hasItem('key')).to.be.false;
    };

    this.testGetItemInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.getItem(key);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    this.testGetItemsInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.getItems([ 'key', key, 'key2' ]);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    this.testHasItemInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.hasItem(key);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    this.testDeleteItemInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.deleteItem(key);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    this.testDeleteItemsInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.deleteItems([ 'key', key, 'key2' ]);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    this.testDefaultLifetime = async () => {
        const cache = this._createCachePool(2);

        let item = await cache.getItem('key.dlt');
        item.set('value');
        await cache.save(item);

        await __jymfony.sleep(1);
        item = await cache.getItem('key.dlt');
        expect(item.isHit).to.be.true;

        await __jymfony.sleep(3000);
        item = await cache.getItem('key.dlt');
        expect(item.isHit).to.be.false;
    };

    this.testExpiration = async () => {
        await this._cache.save((await this._cache.getItem('k1')).set('v1').expiresAfter(2));
        await this._cache.save((await this._cache.getItem('k2')).set('v2').expiresAfter(366 * 86400));

        await __jymfony.sleep(3000);
        let item = await this._cache.getItem('k1');
        expect(item.isHit).to.be.false;
        expect(item.get()).to.be.undefined;

        item = await this._cache.getItem('k2');
        expect(item.isHit).to.be.true;
        expect(item.get()).to.be.equal('v2');
    };

    this.testNotUnserializable = async () => {
        let item = await this._cache.getItem('foo');
        await this._cache.save(item.set(new NotUnserializable()));

        item = await this._cache.getItem('foo');
        expect(item.isHit).to.be.false;
    };

    it('should work', this.testBasicUsage);
    it('should use default lifetime', this.testDefaultLifetime);
    it('should respect expiration', this.testExpiration);
    it('should not hit unserializable values', this.testNotUnserializable);
    it('should work with long keys', this.testBasicUsageWithLongKeys);
    it('modifiers should returns same object (fluid interface)', this.testItemModifiersReturnsSelf);
    it('getItem should work', this.testGetItem);
    it('getItems should work', this.testGetItems);
    it('hasItem should work', this.testHasItem);
    it('clear should work', this.testClear);
    it('deleteItem should work', this.testDeleteItem);
    it('deleteItems should work', this.testDeleteItems);
    it('save should work', this.testSave);
    it('save should discard expired items', this.testSaveExpired);

    let index = 0;
    for (const key of invalidKeys()) {
        it(
            'getItem should throw on invalid key with dataset #' + index++,
            this.testGetItemInvalidKeys ?
                () => this.testGetItemInvalidKeys(key)
                : undefined
        );

        it(
            'getItems should throw on invalid key with dataset #' + index,
            this.testGetItemsInvalidKeys ?
                () => this.testGetItemsInvalidKeys(key)
                : undefined
        );

        it(
            'hasItem should throw on invalid key with dataset #' + index,
            this.testHasItemInvalidKeys ?
                () => this.testHasItemInvalidKeys(key)
                : undefined
        );

        it(
            'deleteItem should throw on invalid key with dataset #' + index,
            this.testDeleteItemInvalidKeys ?
                () => this.testDeleteItemInvalidKeys(key)
                : undefined
        );

        it(
            'deleteItems should throw on invalid key with dataset #' + index,
            this.testDeleteItemsInvalidKeys ?
                () => this.testDeleteItemsInvalidKeys(key)
                : undefined
        );
    }

    /**
     * Creates a cache pool for the test suite.
     *
     * @param {int} [defaultLifetime]
     *
     * @returns {Jymfony.Component.Cache.CacheItemPoolInterface}
     *
     * @protected
     * @abstract
     */
    this._createCachePool = (defaultLifetime = undefined) => { // eslint-disable-line no-unused-vars
        throw new Error('You should implement _createCachePool method');
    };
};
