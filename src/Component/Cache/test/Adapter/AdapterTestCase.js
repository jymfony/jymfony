import { @dataProvider } from '@jymfony/decorators';
import { expect } from 'chai';

const DateTime = Jymfony.Component.DateTime.DateTime;
const InvalidArgumentException = Jymfony.Contracts.Cache.Exception.InvalidArgumentException;
const NotUnserializable = Jymfony.Component.Cache.Fixtures.NotUnserializable;
const PruneableInterface = Jymfony.Component.Cache.PruneableInterface;
const TimeSpan = Jymfony.Component.DateTime.TimeSpan;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

/**
 * @memberOf Jymfony.Component.Cache.Tests.Adapter
 */
export class AdapterTestCase extends TestCase {
    __construct() {
        super.__construct();

        this._cache = undefined;
    }

    get testCaseName() {
        return '[Cache] ' + super.testCaseName;
    }

    beforeEach() {
        this._cache = this._createCachePool();

        if (this._context.currentTest === 'testPrune' && ! (this._cache instanceof PruneableInterface)) {
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
    }

    async testBasicUsageWithLongKeys() {
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
    }


    async testItemModifiersReturnsSelf() {
        const item = await this._cache.getItem('key');

        expect(item.set('4711')).to.be.equal(item);
        expect(item.expiresAfter(2)).to.be.equal(item);
        expect(item.expiresAt(DateTime.now.modify(new TimeSpan('PT2H')))).to.be.equal(item);
    }

    async testGetItem() {
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
    }

    async testGetItems() {
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
    }

    async testHasItem() {
        const item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        expect(await this._cache.hasItem('key')).to.be.true;
        expect(await this._cache.hasItem('key2')).to.be.false;
    }

    async testClear() {
        const item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        expect(await this._cache.clear()).to.be.true;
        expect((await this._cache.getItem('key')).isHit).to.be.false;
        expect(await this._cache.hasItem('key2')).to.be.false;
    }

    async testDeleteItem() {
        const item = await this._cache.getItem('key');
        item.set('value');
        await this._cache.save(item);

        expect(await this._cache.deleteItem('key')).to.be.true;
        expect((await this._cache.getItem('key')).isHit).to.be.false;
        expect(await this._cache.hasItem('key')).to.be.false;

        // Requesting deletion of non-existent key should return true
        expect(await this._cache.deleteItem('key2')).to.be.true;
    }

    async testDeleteItems() {
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
    }

    async testSave() {
        const item = await this._cache.getItem('key');
        item.set('value');

        expect(await this._cache.save(item)).to.be.true;
        expect((await this._cache.getItem('key')).get()).to.be.equal('value');
    }

    async testSaveExpired() {
        const item = await this._cache.getItem('key');
        item.set('value');
        item.expiresAt(new DateTime(DateTime.unixTime + 10));
        expect(await this._cache.save(item)).to.be.true;
        item.expiresAt(new DateTime(DateTime.unixTime -1));
        await this._cache.save(item);

        expect(await this._cache.hasItem('key')).to.be.false;
    }

    @dataProvider('provideInvalidKeys')
    async testGetItemInvalidKeys(key) {
        let caught;
        try {
            await this._cache.getItem(key);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    }

    @dataProvider('provideInvalidKeys')
    async testGetItemsInvalidKeys(key) {
        let caught;
        try {
            await this._cache.getItems([ 'key', key, 'key2' ]);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    }

    @dataProvider('provideInvalidKeys')
    async testHasItemInvalidKeys(key) {
        let caught;
        try {
            await this._cache.hasItem(key);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    }

    @dataProvider('provideInvalidKeys')
    async testDeleteItemInvalidKeys(key) {
        let caught;
        try {
            await this._cache.deleteItem(key);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    }

    @dataProvider('provideInvalidKeys')
    async testDeleteItemsInvalidKeys(key) {
        let caught;
        try {
            await this._cache.deleteItems([ 'key', key, 'key2' ]);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    }

    async testDefaultLifetime() {
        this.setTimeout(60000);
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
    }

    async testExpiration() {
        this.setTimeout(60000);
        await this._cache.save((await this._cache.getItem('k1')).set('v1').expiresAfter(2));
        await this._cache.save((await this._cache.getItem('k2')).set('v2').expiresAfter(366 * 86400));

        await __jymfony.sleep(3000);
        let item = await this._cache.getItem('k1');
        expect(item.isHit).to.be.false;
        expect(item.get()).to.be.undefined;

        item = await this._cache.getItem('k2');
        expect(item.isHit).to.be.true;
        expect(item.get()).to.be.equal('v2');
    }

    async testNotUnserializable() {
        let item = await this._cache.getItem('foo');
        await this._cache.save(item.set(new NotUnserializable()));

        item = await this._cache.getItem('foo');
        expect(item.isHit).to.be.false;
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
