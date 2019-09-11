import { parse as urlParse } from 'url';

const AbstractAdapter = Jymfony.Component.Cache.Adapter.AbstractAdapter;
const RedisTrait = Jymfony.Component.Cache.Traits.RedisTrait;

let Redis;
let RedisCluster;

try {
    Redis = require('ioredis');
    RedisCluster = Redis.Cluster;
} catch (e) {
    // Do nothing
}

const parseHosts = (params, dsn) => {
    let hosts = {};
    if (params.query) {
        const query = __jymfony.parse_query_string(params.query);
        params.query = query;
        if (query.host) {
            if (! isObjectLiteral(query.host)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Invalid Redis DSN: %s', dsn));
            }

            let host, parameters;
            hosts = {};
            for ([ host, parameters ] of __jymfony.getEntries(query.host)) {
                if (isString(parameters)) {
                    parameters = __jymfony.parse_query_string(parameters);
                }

                const i = host.lastIndexOf(':');
                let port;
                if (-1 === i) {
                    hosts[host] = Object.assign({}, parameters, { protocol: 'redis:', hostname: host, port: 6379 });
                } else if (!! (port = ~~(host.substr(1 + i)))) {
                    hosts[host] = Object.assign({}, parameters, { protocol: 'redis:', hostname: host.substr(0, i), port });
                } else {
                    hosts[host] = Object.assign({}, parameters, { path: host.substr(0, i) });
                }
            }
        }
    }

    hosts = Object.values(hosts);
    if (params.hostname) {
        hosts.unshift({ protocol: 'redis:', hostname: params.hostname, port: params.port || 6379 });
    } else if (params.path) {
        hosts.unshift({ path: params.path });
    }

    return hosts;
};

/**
 * @memberOf Jymfony.Component.Cache.Adapter
 */
export default class RedisAdapter extends mix(AbstractAdapter, RedisTrait) {
    /**
     * Constructor.
     *
     * @param {Redis|redis.Cluster} redisClient
     * @param {string} [namespace = '']
     * @param {int} [defaultLifetime = 0]
     */
    __construct(redisClient, namespace = '', defaultLifetime = 0) {
        this._init(redisClient, namespace);
        super.__construct(namespace, defaultLifetime);
    }

    /**
     * Creates a Redis connection using a DSN configuration.
     *
     * Example DSN:
     *   - redis://localhost
     *   - redis://example.com:1234
     *   - redis://secret@example.com/13
     *   - redis:///var/run/redis.sock
     *   - redis://secret@/var/run/redis.sock/13
     *
     * @param {string} dsn
     * @param {Object.<string, *>} options See RedisTrait.defaultConnectionOptions
     *
     * @throws {InvalidArgumentException} when the DSN is invalid
     *
     * @returns {Redis|RedisCluster} According to the "class" option
     */
    static createConnection(dsn, options = {}) {
        const params = (() => {
            try {
                return urlParse(dsn);
            } catch (e) {
                throw new InvalidArgumentException(__jymfony.sprintf('Invalid Redis DSN: %s', dsn));
            }
        })();

        if ('redis:' !== params.protocol) {
            throw new InvalidArgumentException(__jymfony.sprintf('Invalid Redis DSN: %s does not start with "redis:"', dsn));
        }

        params.path = undefined;
        if (params.pathname) {
            const match = params.pathname.match(/(\d+)$/);
            if (match) {
                options.dbindex = match[1];
                params.pathname = params.pathname.substr(0, params.pathname.length - match[0].length);
            }
        }

        const hosts = parseHosts(params, dsn);
        if (0 === hosts.length) {
            throw new InvalidArgumentException(__jymfony.sprintf('Invalid Redis DSN: %s', dsn));
        }

        Object.assign(params, RedisTrait.defaultConnectionOptions, options, params.query, params);

        let redis;
        if (params.redis_cluster) {
            redis = new RedisCluster(hosts.map(v => {
                return {
                    host: v.hostname,
                    port: v.port,
                };
            }), {
                showFriendlyErrorStack: true,
                connectTimeout: params.timeout,
                lazyConnect: true,
                retryStrategy: () => {
                    return Math.max(1, params.retry_interval * 1000);
                },
            });
        } else {
            redis = new Redis({
                port: params.port,
                host: params.hostname,
                password: params.auth ? __jymfony.ltrim(params.auth, ':') : undefined,
                db: params.dbindex,
                showFriendlyErrorStack: true,
                connectTimeout: params.timeout,
                lazyConnect: true,
                retryStrategy: () => {
                    return Math.max(1, params.retry_interval * 1000);
                },
            });
        }

        redis.on('error', async (e) => {
            if ('ENOTFOUND' === e.code || 'ECONNREFUSED' === e.code || 'EADDRNOTAVAIL' === e.code) {
                await redis.quit();
            }
        });

        return redis;
    }
}
