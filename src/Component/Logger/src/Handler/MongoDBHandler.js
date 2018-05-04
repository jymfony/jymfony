const MongoDBFormatter = Jymfony.Component.Logger.Formatter.MongoDBFormatter;
const AbstractProcessingHandler = Jymfony.Component.Logger.Handler.AbstractProcessingHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;

class MongoDBHandler extends AbstractProcessingHandler {
    /**
     * Constructor.
     *
     * @param {MongoClient} client The mongodb client.
     * @param {string} collection The target collection name.
     * @param {int} [level = LogLevel.DEBUG] The minimum logging level at which this handler will be triggered.
     * @param {boolean} [bubble = true] Whether the messages that are handled can bubble up the stack or not.
     *
     * @inheritdoc
     */
    __construct(client, collection, level = LogLevel.DEBUG, bubble = true) {
        this._client = client;
        this._collection = collection;

        this._client.on('close', () => {
            this._connection = undefined;
        });

        super.__construct(level, bubble);
    }

    /**
     * @inheritdoc
     */
    getDefaultFormatter() {
        return new MongoDBFormatter();
    }

    close() {
        if (undefined !== this._connection) {
            this._client.close();
            this._connection = undefined;
        }
    }

    /**
     * @inheritdoc
     */
    _write(record) {
        if (undefined === this._connection) {
            this._connection = this._client.connect()
                .catch(() => this._connection = undefined);
        }

        this._connection.then(() => {
            if (undefined === this._connection) {
                return;
            }

            this._client.db().collection(this._collection)
                .insertOne(record.formatted, {w: 0, j: false}, (err) => {
                    if (err) {
                        this.close();
                    }
                });
        });
    }

}

module.exports = MongoDBHandler;
