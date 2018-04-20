const AbstractProcessingHandler = Jymfony.Component.Logger.Handler.AbstractProcessingHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;
const MongoServer = require('mongodb-core').Server;

class MongoDBHandler extends AbstractProcessingHandler {
    /**
     * Constructor.
     *
     * @param {string} database - Database name
     * @param {string} collection - Collection name
     * @param {string} [host] - Host to connect
     * @param {string} [port] - Port to connect
     * @param {Server} [server] - Collection name
     * @param {number} [level = 100] - The minimum logging level at which this handler will be triggered
     * @param {boolean} [bubble = true] - Whether the messages that are handled can bubble up the stack or not
     */
    __construct(
        database,
        collection,
        host = undefined,
        port = undefined,
        server = null,
        level = LogLevel.DEBUG,
        bubble = true
    ) {
        if (!host && !port && !server) {
            throw new LogicException('You must provider an url with port or a server to connect');
        }

        this._host = host;
        this._port = port;
        this._server = server;
        this._namespace = `${database}.${collection}`;

        super.__construct(level, bubble);
    }

    _write(record) {
        if (!this._server) {
            this._server = new MongoServer({
                host: this._host,
                port: this._port,
                reconnect: true,
                reconnectInterval: 50,
            });
        }

        this._server.on('connect', (server) => {
            server.command('system.$cmd', {ismaster: true}, () => {
                server.insert(this._namespace, [ record ]);
            });
        });
    }

}

module.exports = MongoDBHandler;
