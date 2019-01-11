const AdapterTestCase = require('./AdapterTestCase');
const RedisAdapter = Jymfony.Component.Cache.Adapter.RedisAdapter;

const hosts = 'redis:?host[' + (process.env['REDIS_CLUSTER_HOSTS'] || 'localhost').replace(/ /g, ']&host[') + ']&redis_cluster=1';
const redis = RedisAdapter.createConnection(hosts);

describe('[Cache] RedisAdapter - Cluster', function () {
    AdapterTestCase.shouldPassAdapterTests.call(this);

    before(async function () {
        const redis = RedisAdapter.createConnection(hosts);

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

    this._createCachePool = (defaultLifetime = undefined) => {
        return new RedisAdapter(redis, 'RedisClusterTest', defaultLifetime);
    };
});
