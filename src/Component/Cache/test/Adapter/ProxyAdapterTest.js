import { expect } from 'chai';
import { AdapterTestCase } from './AdapterTestCase';

const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;
const CacheItem = Jymfony.Component.Cache.CacheItem;
const ProxyAdapter = Jymfony.Component.Cache.Adapter.ProxyAdapter;

export default class ProxyAdapterTest extends AdapterTestCase {
    _createCachePool(defaultLifetime = 0) {
        return new ProxyAdapter(new ArrayAdapter(), '', defaultLifetime);
    }

    async testProxyfiedItem() {
        this.expectException('Exception');
        this.expectExceptionMessage('OK bar');

        const item = new CacheItem();
        const pool = new ProxyAdapter(new TestingArrayAdapter(item));

        const proxyItem = await pool.getItem('foo');

        expect(item).to.be.not.equal(proxyItem);
        await pool.save(proxyItem.set('bar'));
    }
}

class TestingArrayAdapter extends ArrayAdapter {
    __construct(item) {
        this._item = item;
    }

    getItem(key) {
        return this._item;
    }

    async save(item) {
        if (item === this._item) {
            throw new Exception('OK ' + item.get());
        }

        return false;
    }
}
