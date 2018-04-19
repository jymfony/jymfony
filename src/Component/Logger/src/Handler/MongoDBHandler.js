const AbstractProcessingHandler = Jymfony.Component.Logger.Handler.AbstractProcessingHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;
const MongoClient = require('mongodb').MongoClient;

class MongoDBHandler extends AbstractProcessingHandler {
    /**
     * Constructor.
     *
     * @param {string} url - URL to connect
     * @param {string} database - Database name
     * @param {string} collection - Collection name
     * @param {number} level - The minimum logging level at which this handler will be triggered
     * @param {boolean} [bubble = 100] - Whether the messages that are handled can bubble up the stack or not
     */
    __construct(url, database, collection, level = LogLevel.DEBUG, bubble = true) { // [DOUBT] too much simplified?
        this._url = `${url}/${database}`;
        this._database = database;
        this._collection = collection;

        super.__construct(level, bubble);
    }

    async _write(record) { // [DOUBT] asynchronous write on mongodb, but it open and close the connection every time.
        let client;

        try {
            client = await MongoClient.connect(this._url);

            await client.db(this._database).collection(this._collection).insertOne(record);
        } catch(err) {
            console.log(`[ERROR][MONGODB] - ${err}`);
        } finally {
            if (!!client) {
                client.close();
            }
        }
    }

}

module.exports = MongoDBHandler;
