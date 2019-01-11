const AdapterTestCase = require('./AdapterTestCase');
const RedisAdapter = Jymfony.Component.Cache.Adapter.RedisAdapter;

const redis = RedisAdapter.createConnection('redis://' + process.env['REDIS_HOST']);

describe('[Cache] RedisAdapter', function () {
    before(async function () {
        const redis = RedisAdapter.createConnection('redis://' + process.env['REDIS_HOST']);

        try {
            await redis.connect();
        } catch (e) {
            this.skip();
        } finally {
            if ('end' !== redis.status) {
                await redis.quit();
            }
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
