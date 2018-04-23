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
     */
    __construct(client, collection, level = LogLevel.DEBUG, bubble = true) {
        this._client = client;
        this._collection = collection;

        super.__construct(level, bubble);
    }

    /**
     * @inheritDoc
     */
    getDefaultFormatter() {
        return new MongoDBFormatter();
    }

    /**
     * @inheritDoc
     */
    _write(record) {
        this._client.db().collection(this._collection)
            .insertOne(record.formatted, {w: 0, j: false}, (err) => {
                if (err) {
                    this.close();
                }
            });
    }

}

module.exports = MongoDBHandler;
