import Redis, { Cluster as RedisCluster } from 'ioredis' with { optional: 'true' };

const InvalidArgumentException = Jymfony.Contracts.Cache.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Cache.Traits
 */
class RedisTrait {
    /**
     * Initializes the redis adapter.
     *
     * @param {Redis|redis.Cluster} redisClient
     * @param {string} namespace
     *
     * @private
     */
    _init(redisClient, namespace) {
        const match = (namespace || '').match(/[^-+_.A-Za-z0-9]/);
        if (match) {
            throw new InvalidArgumentException(__jymfony.sprintf('RedisAdapter namespace contains "%s" but only characters in [-+_.A-Za-z0-9] are allowed.', match[0]));
        }

        if (! (redisClient instanceof Redis || redisClient instanceof RedisCluster)) {
            throw new InvalidArgumentException(__jymfony.sprintf('init() expects parameter 1 to be Redis or RedisCluster, %s given.', __jymfony.get_debug_type(redisClient)));
        }

        /**
         * @type {Redis|redis.Cluster}
         *
         * @private
         */
        this._redis = redisClient;
    }

    /**
     * @inheritdoc
     */
    async _doFetch(ids) {
        if (! ids || 0 === ids.length) {
            return {};
        }

        let results;
        if (this._redis instanceof RedisCluster) {
            const promises = [];
            for (const key of ids) {
                promises.push(this._redis.get(key).catch(() => null));
            }

            results = await Promise.all(promises);
        } else {
            results = await this._redis.mget(...ids);
        }

        return results.reduce((res, val, idx) => {
            if (null !== val) {
                res[ids[idx]] = __jymfony.unserialize(val);
            }

            return res;
        }, {});
    }

    /**
     * @inheritdoc
     */
    async _doHave(id) {
        return !! await this._redis.exists(id);
    }

    /**
     * @inheritdoc
     */
    async _doClear(namespace) {
        const hosts = this._redis instanceof RedisCluster ? this._redis.nodes('master') : [ this._redis ];

        let cleared = true;
        for (const host of hosts) {
            if (! namespace) {
                cleared = 'OK' === (await host.flushdb());
            }

            let info = await host.info('Server');
            info = info.Server || info;

            const versionMatch = info.match(/^redis_version:(.+)$/m);
            if (! versionMatch || __jymfony.version_compare(versionMatch[1], '2.8', '<')) {
                // As documented in Redis documentation (http://redis.io/commands/keys) using KEYS
                // Can hang your server when it is executed against large databases (millions of items).
                // Whenever you hit this scale, you should really consider upgrading to Redis 2.8 or above.
                cleared = !! host.eval('local keys=redis.call(\'KEYS\',ARGV[1]..\'*\') for i=1,#keys,5000 do redis.call(\'DEL\',unpack(keys,i,math.min(i+4999,#keys))) end return 1', [ namespace ], 0) && cleared;
                continue;
            }

            const p = new Promise(((resolve, reject) => {
                const stream = host.scanStream({
                    match: namespace + '*',
                    count: 1000,
                });

                stream.on('error', reject);
                stream.on('end', resolve);

                stream.on('data', async (resultKeys) => {
                    try {
                        await this._doDelete(resultKeys);
                    } catch (e) {
                        reject(e);
                    }
                });
            }));

            await p;
        }

        return cleared;
    }

    /**
     * @inheritdoc
     */
    async _doDelete(ids) {
        if (! ids || 0 === ids.length) {
            return true;
        }

        const pipeline = this._redis.pipeline();
        ids.forEach(function (key) {
            pipeline.del(key);
        });

        await pipeline.exec();

        return true;
    }

    /**
     * @inheritdoc
     */
    async _doSave(values, lifetime) {
        const pipeline = this._redis.pipeline();
        for (const [ id, value ] of __jymfony.getEntries(values)) {
            if (0 >= lifetime) {
                pipeline.set(id, __jymfony.serialize(value));
            } else {
                pipeline.set(id, __jymfony.serialize(value), 'ex', lifetime);
            }
        }

        const results = await pipeline.exec();
        for (const result of results) {
            if ('OK' !== result[1]) {
                return false;
            }
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    async close() {
        this._redis.disconnect();
    }
}

RedisTrait.defaultConnectionOptions = {
    timeout: 30,
    retry_interval: 0,
    redis_cluster: false,
    dbindex: 0,
};

export default getTrait(RedisTrait);
