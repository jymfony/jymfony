const AdapterTestCase = require('./AdapterTestCase');
const RedisAdapter = Jymfony.Component.Cache.Adapter.RedisAdapter;

const redis = RedisAdapter.createConnection('redis://' + process.env['REDIS_HOST']);

describe('[Cache] RedisAdapter', function () {
    before(async function () {
        const redis = RedisAdapter.createConnection('redis://' + process.env['REDIS_HOST']);

        try {
            await redis.connect();
            await redis.disconnect();
        } catch (e) {
            this.skip();
        }
    });

    after(async () => {
        await redis.quit();
    });

    AdapterTestCase.shouldPassAdapterTests.call(this);

    this._createCachePool = (defaultLifetime = undefined) => {
        return new RedisAdapter(redis, 'RedisAdapterTest', defaultLifetime);
    };
});
