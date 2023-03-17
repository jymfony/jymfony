const AdapterTestCase = Jymfony.Component.Cache.Tests.Adapter.AdapterTestCase;
const RedisAdapter = Jymfony.Component.Cache.Adapter.RedisAdapter;
const hosts = 'redis:?host[' + (process.env['REDIS_CLUSTER_HOSTS'] || 'localhost').replace(/ /g, ']&host[') + ']&redis_cluster=1';
const redis = RedisAdapter.createConnection(hosts);

export default class RedisClusterTest extends AdapterTestCase {
    async before() {
        const redis = RedisAdapter.createConnection(hosts);

        try {
            await redis.connect();
        } catch (e) {
            __self.markTestSkipped();
        } finally {
            if ('end' !== redis.status) {
                await redis.quit();
            }
        }
    }

    async after() {
        await redis.quit();
    }

    _createCachePool(defaultLifetime = undefined) {
        return new RedisAdapter(redis, 'RedisClusterTest', defaultLifetime);
    }
}
