const AdapterTestCase = Jymfony.Component.Cache.Tests.Adapter.AdapterTestCase;
const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;

export default @timeSensitive() class ArrayAdapterTest extends AdapterTestCase {
    async testValuesShouldReturnAllTheValues() {
        let item = await this._cache.getItem('key');
        item.set('4711');
        await this._cache.save(item);

        item = await this._cache.getItem('key2');
        item.set('4712');
        await this._cache.save(item);

        const values = this._cache.values;
        __self.assertEquals([ 'key', 'key2' ], Object.keys(values));
        __self.assertEquals(__jymfony.serialize('4711'), values.key);
    }

    _createCachePool(defaultLifetime = undefined) {
        return new ArrayAdapter(defaultLifetime);
    }
}
