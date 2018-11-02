require('../../fixtures/namespace');

const InvalidArgumentException = Jymfony.Component.Cache.Exception.InvalidArgumentException;
const PruneableInterface = Jymfony.Component.Cache.PruneableInterface;
const NotUnserializable = Jymfony.Component.Cache.Fixtures.NotUnserializable;
const expect = require('chai').expect;

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
            this._skippedTests['testPrune'] = 'Not a pruneable cache pool.';
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

    const testBasicUsage = async () => {
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

    const testGetItemInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.getItem(key);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    const testGetItemsInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.getItems([ 'key', key, 'key2' ]);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    const testHasItemInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.hasItem(key);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    const testDeleteItemInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.deleteItem(key);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    const testDeleteItemsInvalidKeys = async (key) => {
        let caught;
        try {
            await this._cache.deleteItems([ 'key', key, 'key2' ]);
        } catch (e) {
            caught = e;
        }

        expect(caught).to.be.instanceOf(InvalidArgumentException);
    };

    const testDefaultLifetime = async () => {
        const cache = this._createCachePool(2);

        let item = await cache.getItem('key.dlt');
        item.set('value');
        await cache.save(item);

        await __jymfony.sleep(1000);
        item = await cache.getItem('key.dlt');
        expect(item.isHit).to.be.true;

        await __jymfony.sleep(2000);
        item = await cache.getItem('key.dlt');
        expect(item.isHit).to.be.false;
    };

    const testExpiration = async () => {
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

    const testNotUnserializable = async () => {
        let item = await this._cache.getItem('foo');
        await this._cache.save(item.set(new NotUnserializable()));

        item = await this._cache.getItem('foo');
        expect(item.isHit).to.be.false;
    };

    it('should work', ! this._skippedTests.testBasicUsage ? testBasicUsage : undefined);
    it('should use default lifetime', ! this._skippedTests.testDefaultLifetime ? testDefaultLifetime : undefined);
    it('should respect expiration', ! this._skippedTests.testExpiration ? testExpiration : undefined);
    it('should not hit unserializable values', ! this._skippedTests.testNotUnserializable ? testNotUnserializable : undefined);

    let index = 0;
    for (const key of invalidKeys()) {
        it(
            'getItem should throw on invalid key with dataset #' + index++,
            ! this._skippedTests.testGetItemInvalidKeys ?
                () => testGetItemInvalidKeys(key)
                : undefined
        );

        it(
            'getItems should throw on invalid key with dataset #' + index,
            ! this._skippedTests.testGetItemsInvalidKeys ?
                () => testGetItemsInvalidKeys(key)
                : undefined
        );

        it(
            'hasItem should throw on invalid key with dataset #' + index,
            ! this._skippedTests.testHasItemInvalidKeys ?
                () => testHasItemInvalidKeys(key)
                : undefined
        );

        it(
            'deleteItem should throw on invalid key with dataset #' + index,
            ! this._skippedTests.testDeleteItemInvalidKeys ?
                () => testDeleteItemInvalidKeys(key)
                : undefined
        );

        it(
            'deleteItems should throw on invalid key with dataset #' + index,
            ! this._skippedTests.testDeleteItemsInvalidKeys ?
                () => testDeleteItemsInvalidKeys(key)
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
