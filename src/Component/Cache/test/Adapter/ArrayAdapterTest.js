const AdapterTestCase = require('./AdapterTestCase');
const ArrayAdapter = Jymfony.Component.Cache.Adapter.ArrayAdapter;

describe('[Cache] ArrayAdapter', function () {
    AdapterTestCase.shouldPassAdapterTests.call(this);

    this._createCachePool = (defaultLifetime = undefined) => {
        return new ArrayAdapter(defaultLifetime);
    };
});
