declare namespace Jymfony.Component.Cache.Adapter {
    import RedisTrait = Jymfony.Component.Cache.Traits.RedisTrait;

    export interface RedisConnectionOptions {
        timeout: number,
        retry_interval: number,
        redis_cluster: boolean,
        dbindex: number,
    }

    export class RedisAdapter extends mix(AbstractAdapter, RedisTrait) {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(redisClient: any, namespace?: string, defaultLifetime?: number): void;
        constructor(redisClient: any, namespace?: string, defaultLifetime?: number);

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
         * @throws {InvalidArgumentException} when the DSN is invalid
         */
        static createConnection(dsn: string, options?: RedisConnectionOptions): RedisAdapter;
    }
}
