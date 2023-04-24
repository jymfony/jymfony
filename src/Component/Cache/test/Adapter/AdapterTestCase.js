const DateTime = Jymfony.Component.DateTime.DateTime;
const InvalidArgumentException = Jymfony.Contracts.Cache.Exception.InvalidArgumentException;
const NotUnserializable = Jymfony.Component.Cache.Fixtures.NotUnserializable;
const PruneableInterface = Jymfony.Component.Cache.PruneableInterface;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

/**
 * @memberOf Jymfony.Component.Cache.Tests.Adapter
 */
export default class AdapterTestCase extends TestCase {
    _cache;

    get testCaseName() {
        return '[Cache] ' + super.testCaseName;
    }

    beforeEach() {
        this._cache = this._createCachePool();

        if ('testPrune' === this._context.currentTest && ! (this._cache instanceof PruneableInterface)) {
            this.markTestSkipped();
        }
    }

    async afterEach() {
        if (this._cache) {
            await this._cache.clear();
        }
    }


    /**
     * Data provider for invalid keys.
     */
    * provideInvalidKeys() {
        yield [ true ];
        yield [ false ];
        yield [ null ];
        yield [ 2 ];
        yield [ 2.5 ];
        yield [ '{str' ];
        yield [ 'rand{' ];
        yield [ 'rand{str' ];
        yield [ 'rand}str' ];
        yield [ 'rand(str' ];
        yield [ 'rand)str' ];
        yield [ 'rand/str' ];
        yield [ 'rand\\str' ];
        yield [ 'rand@str' ];
        yield [ 'rand:str' ];
        yield [ {} ];
        yield [ [ 'array' ] ];
    }

    async testBasicUsage() {
        let item = await this._cache.getItem('key');
        item.set('4711');
        await this._cache.save(item);

        item = await this._cache.getItem('key2');
        item.set('4712');
        await this._cache.save(item);

        const fooItem = await this._cache.getItem('key');
        __self.assertTrue(fooItem.isHit);
        __self.assertEquals('4711', fooItem.get());

        const barItem = await this._cache.getItem('key2');
        __self.assertTrue(barItem.isHit);
        __self.assertEquals('4712', barItem.get());

        await this._cache.deleteItem('key');
        __self.assertFalse((await this._cache.getItem('key')).isHit);
        __self.assertTrue((await this._cache.getItem('key2')).isHit);

        await this._cache.deleteItem('key2');
        __self.assertFalse((await this._cache.getItem('key')).isHit);
        __self.assertFalse((await this._cache.getItem('key2')).isHit);
    }

    async testBasicUsageWithLongKeys() {
        const key = 'a'.repeat(300);

        let item = await this._cache.getItem(key);
        __self.assertFalse(item.isHit);
        __self.assertEquals(key, item.key);
        item.set('value');
        __self.assertTrue(await this._cache.save(item));

        item = await this._cache.getItem(key);
        __self.assertTrue(item.isHit);
        __self.assertEquals(key, item.key);
        __self.assertEquals('value', item.get());

        __self.assertTrue(await this._cache.deleteItem(key));

        item = await this._cache.getItem(key);
        __self.assertFalse(item.isHit);
    }


    async testItemModifiersReturnsSelf() {
        const item = await this._cache.getItem('key');

        __self.assertEquals(item, item.set('4711'));
        __self.assertEquals(item, item.expiresAfter(2));
        __self.assertEquals(item, item.expiresAt(DateTime.now.modify(new TimeSpan('PT2H'))));
    }

    async testGetItem() {
        let item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        item = await this._cache.getItem('key');
        __self.assertTrue(item.isHit);
        __self.assertEquals('key', item.key);
        __self.assertEquals('value', item.get());

        item = await this._cache.getItem('key2');
        __self.assertFalse(item.isHit);
        __self.assertUndefined(item.get());
    }

    async testGetItems() {
        const keys = [ 'foo', 'bar', 'baz' ];
        let items = await this._cache.getItems(keys);

        for (const [ k, item ] of items.entries()) {
            item.set(k);
            await this._cache.save(item);
        }

        __self.assertEquals(3, items.size);

        keys.push('biz');
        items = await this._cache.getItems(keys);
        let count = 0;
        for (const [ key, item ] of items.entries()) {
            const itemKey = item.key;

            __self.assertEquals(key, itemKey);
            __self.assertEquals('biz' !== key, item.isHit);
            __self.assertEquals('biz' !== key ? key : undefined, item.get());
            __self.assertNotEquals(-1, keys.indexOf(key));

            count++;
        }

        __self.assertEquals(4, count);

        items = await this._cache.getItems([]);
        __self.assertInstanceOf(Map, items);
        __self.assertEquals(0, items.size);
    }

    async testHasItem() {
        const item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        __self.assertTrue(await this._cache.hasItem('key'));
        __self.assertFalse(await this._cache.hasItem('key2'));
    }

    async testClear() {
        const item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        __self.assertTrue(await this._cache.clear());
        __self.assertFalse((await this._cache.getItem('key')).isHit);
        __self.assertFalse(await this._cache.hasItem('key2'));
    }

    async testDeleteItem() {
        const item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        __self.assertTrue(await this._cache.deleteItem('key'));
        __self.assertFalse((await this._cache.getItem('key')).isHit);
        __self.assertFalse(await this._cache.hasItem('key'));

        // Requesting deletion of non-existent key should return true
        __self.assertTrue(await this._cache.deleteItem('key2'));
    }

    async testDeleteItems() {
        const keys = [ 'foo', 'bar', 'baz' ];
        const items = await this._cache.getItems(keys);

        for (const [ k, item ] of items.entries()) {
            item.set(k);
            await this._cache.save(item);
        }

        __self.assertTrue(await this._cache.hasItem('foo'));
        __self.assertTrue(await this._cache.hasItem('bar'));
        __self.assertTrue(await this._cache.hasItem('baz'));
        __self.assertFalse(await this._cache.hasItem('biz'));

        await this._cache.deleteItems(keys);

        __self.assertFalse(await this._cache.hasItem('foo'));
        __self.assertFalse(await this._cache.hasItem('bar'));
        __self.assertFalse(await this._cache.hasItem('baz'));
        __self.assertFalse(await this._cache.hasItem('biz'));
    }

    async testSave() {
        const item = await this._cache.getItem('key');
        item.set('value');

        __self.assertTrue(await this._cache.save(item));
        __self.assertEquals('value', (await this._cache.getItem('key')).get());
    }

    async testSaveExpired() {
        const item = await this._cache.getItem('key');
        item.set('value');
        item.expiresAt(new DateTime(DateTime.unixTime + 10));
        __self.assertTrue(await this._cache.save(item));
        item.expiresAt(new DateTime(DateTime.unixTime -1));
        await this._cache.save(item);

        __self.assertFalse(await this._cache.hasItem('key'));
    }

    @dataProvider('provideInvalidKeys')
    async testGetItemInvalidKeys(key) {
        let caught;
        try {
            await this._cache.getItem(key);
        } catch (e) {
            caught = e;
        }

        __self.assertInstanceOf(InvalidArgumentException, caught);
    }

    @dataProvider('provideInvalidKeys')
    async testGetItemsInvalidKeys(key) {
        let caught;
        try {
            await this._cache.getItems([ 'key', key, 'key2' ]);
        } catch (e) {
            caught = e;
        }

        __self.assertInstanceOf(InvalidArgumentException, caught);
    }

    @dataProvider('provideInvalidKeys')
    async testHasItemInvalidKeys(key) {
        let caught;
        try {
            await this._cache.hasItem(key);
        } catch (e) {
            caught = e;
        }

        __self.assertInstanceOf(InvalidArgumentException, caught);
    }

    @dataProvider('provideInvalidKeys')
    async testDeleteItemInvalidKeys(key) {
        let caught;
        try {
            await this._cache.deleteItem(key);
        } catch (e) {
            caught = e;
        }

        __self.assertInstanceOf(InvalidArgumentException, caught);
    }

    @dataProvider('provideInvalidKeys')
    async testDeleteItemsInvalidKeys(key) {
        let caught;
        try {
            await this._cache.deleteItems([ 'key', key, 'key2' ]);
        } catch (e) {
            caught = e;
        }

        __self.assertInstanceOf(InvalidArgumentException, caught);
    }

    async testDefaultLifetime() {
        this.setTimeout(60000);
        const cache = this._createCachePool(2);

        let item = await cache.getItem('key.dlt');
        item.set('value');
        await cache.save(item);

        await __jymfony.sleep(1);
        item = await cache.getItem('key.dlt');
        __self.assertTrue(item.isHit);

        await __jymfony.sleep(3000);
        item = await cache.getItem('key.dlt');
        __self.assertFalse(item.isHit);
    }

    async testExpiration() {
        this.setTimeout(60000);
        await this._cache.save((await this._cache.getItem('k1')).set('v1').expiresAfter(2));
        await this._cache.save((await this._cache.getItem('k2')).set('v2').expiresAfter(366 * 86400));

        await __jymfony.sleep(3000);
        let item = await this._cache.getItem('k1');
        __self.assertFalse(item.isHit);
        __self.assertUndefined(item.get());

        item = await this._cache.getItem('k2');
        __self.assertTrue(item.isHit);
        __self.assertEquals('v2', item.get());
    }

    async testNotUnserializable() {
        let item = await this._cache.getItem('foo');
        await this._cache.save(item.set(new NotUnserializable()));

        item = await this._cache.getItem('foo');
        __self.assertFalse(item.isHit);
    }

    /**
     * Creates a cache pool for the test suite.
     *
     * @param {int} [defaultLifetime]
     *
     * @returns {Jymfony.Contracts.Cache.CacheItemPoolInterface}
     *
     * @protected
     * @abstract
     */
    _createCachePool(defaultLifetime = undefined) { // eslint-disable-line no-unused-vars
        throw new Error('You should implement _createCachePool method');
    };
}
