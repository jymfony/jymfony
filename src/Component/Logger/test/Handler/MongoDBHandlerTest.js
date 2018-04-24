const Collection = require('mongodb').Collection;
const BSON = require('bson').BSON;
const Db = require('mongodb').Db;
const MongoClient = require('mongodb').MongoClient;
const DateTime = Jymfony.Component.DateTime.DateTime;
const MongoDBHandler = Jymfony.Component.Logger.Handler.MongoDBHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Prophet = Jymfony.Component.Testing.Prophet;

describe('[Logger] MongoDBHandler', function () {
    beforeEach(() => {
        this._prophet = new Prophet();
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('handle should work', () => {
        const mongodb = this._prophet.prophesize(MongoClient);
        const db = this._prophet.prophesize(Db);
        const collection = this._prophet.prophesize(Collection);

        mongodb.db().willReturn(db);
        db.collection('foobar').willReturn(collection);

        const record = {
            channel: 'test',
            message: 'some log message',
            context: {},
            level: LogLevel.WARNING,
            datetime: new DateTime(1524498450),
            extra: {},
        };

        const expected = {
            channel: 'test',
            message: 'some log message',
            context: {},
            level: LogLevel.WARNING,
            datetime: BSON.Timestamp.fromInt(1524498450),
            extra: {},
        };

        collection.insertOne(expected, {w: 0, j: false}, Argument.any()).shouldBeCalled();

        const handler = new MongoDBHandler(mongodb.reveal(), 'foobar');
        handler.handle(record);
    });
});
