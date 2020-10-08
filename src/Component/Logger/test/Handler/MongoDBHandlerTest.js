const Collection = require('mongodb').Collection;
const Db = require('mongodb').Db;
const MongoClient = require('mongodb').MongoClient;
const DateTime = Jymfony.Component.DateTime.DateTime;
const MongoDBHandler = Jymfony.Component.Logger.Handler.MongoDBHandler;
const LogLevel = Jymfony.Contracts.Logger.LogLevel;
const Argument = Jymfony.Component.Testing.Argument.Argument;
const Prophet = Jymfony.Component.Testing.Prophet;

describe('[Logger] MongoDBHandler', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         * @private
         */
        this._prophet = new Prophet();
    });

    afterEach(() => {
        if ('failed' === this.ctx.currentTest.state) {
            return;
        }

        this._prophet.checkPredictions();
    });

    it('handle should work', () => {
        const mongodb = this._prophet.prophesize(MongoClient);
        const db = this._prophet.prophesize(Db);
        const collection = this._prophet.prophesize(Collection);
        const connection = this._prophet.prophesize(Promise);

        connection.catch(Argument.any()).willReturn(connection);
        connection.then(Argument.any())
            .will(cb => {
                cb();

                return connection;
            });

        mongodb.connect().willReturn(connection);
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
            datetime: new Date('2018-04-23T15:47:30Z'),
            extra: {},
        };

        collection.insertOne(expected, {w: 0, j: false}, Argument.any())
            .shouldBeCalled();

        const handler = new MongoDBHandler(mongodb.reveal(), 'foobar');
        handler.handle(record);
    });
});
