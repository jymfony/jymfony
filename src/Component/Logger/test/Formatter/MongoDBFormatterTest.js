const { expect } = require('chai');
const DateTime = Jymfony.Component.DateTime.DateTime;
const LogLevel = Jymfony.Contracts.Logger.LogLevel;
const MongoDBFormatter = Jymfony.Component.Logger.Formatter.MongoDBFormatter;

describe('[Logger] MongoDBFormatter', () => {
    it('format a simple record', () => {
        const record = {
            channel: 'test',
            message: 'some log message',
            context: {},
            level: LogLevel.WARNING,
            datetime: new DateTime(Date.now()),
            extra: {},
        };

        const formatter = new MongoDBFormatter();
        const formattedRecord = formatter.format(record);

        expect(Object.keys(formattedRecord).length).to.equal(6);
        expect('some log message').to.equal(formattedRecord.message);
        expect(Object.keys({}).length).to.equal(Object.keys(formattedRecord.context).length);
        expect(LogLevel.WARNING).to.equal(formattedRecord.level);
        expect(Object.keys({}).length).to.equal(Object.keys(formattedRecord.extra).length);
    });

    it('format depth record', () => {
        const record = {
            channel: 'test',
            message: 'some log message',
            context: {
                nest2: {
                    property: 'anything',
                    nest3: {
                        nest4: 'value',
                        property: 'nothing',
                    },
                },
            },
            level: LogLevel.WARNING,
            datetime: new DateTime(Date.now()),
            extra: {},
        };

        const formatter = new MongoDBFormatter(2);
        const formattedRecord = formatter.format(record);

        expect(formattedRecord.context.nest2.hasOwnProperty('property')).to.be.true;
        expect(formattedRecord.context.nest2.hasOwnProperty('nest3')).to.be.true;
        expect(formattedRecord.context.nest2.nest3).to.equal('[...]');
    });

    it('format exception', () => {
        const record = {
            channel: 'test',
            message: 'some log message',
            context: {
                nest2: new Error('error message'),
            },
            level: LogLevel.WARNING,
            datetime: new DateTime(Date.now()),
            extra: {},
        };

        const formatter = new MongoDBFormatter(2, false);
        const formattedRecord = formatter.format(record);

        expect(formattedRecord.context.nest2.message).to.equal('error message');
        expect(formattedRecord.context.nest2.trace).to.equal('[...]');
    });
});
