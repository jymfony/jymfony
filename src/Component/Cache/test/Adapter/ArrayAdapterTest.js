import { AdapterTestCase } from './AdapterTestCase';
import { expect } from 'chai';

const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;

export default class ArrayAdapterTest extends AdapterTestCase {
    async testValuesShouldReturnAllTheValues() {
        let item = await this._cache.getItem('key');
        item.set('4711');
        await this._cache.save(item);

        item = await this._cache.getItem('key2');
        item.set('4712');
        await this._cache.save(item);

        const values = this._cache.values;
        expect(Object.keys(values)).to.be.deep.equal([ 'key', 'key2' ]);
        expect(values['key']).to.be.equal(__jymfony.serialize('4711'));
    }

    _createCachePool(defaultLifetime = undefined) {
        return new ArrayAdapter(defaultLifetime);
    }
}
