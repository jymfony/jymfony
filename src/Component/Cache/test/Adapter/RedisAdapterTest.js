import { AdapterTestCase } from './AdapterTestCase';

const RedisAdapter = Jymfony.Component.Cache.Adapter.RedisAdapter;
const redis = RedisAdapter.createConnection('redis://' + process.env['REDIS_HOST']);

export default class RedisAdapterTest extends AdapterTestCase {
    async before() {
        const redis = RedisAdapter.createConnection('redis://' + process.env['REDIS_HOST']);

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
        return new RedisAdapter(redis, 'RedisAdapterTest', defaultLifetime);
    }
}
