const BufferingLogger = Jymfony.Component.Debug.BufferingLogger;
const LogLevel = Jymfony.Component.Logger.LogLevel;
const { expect } = require('chai');

describe('[Debug] BufferingLogger', function () {
    it ('should returns all the logs on clear', () => {
        const stream = new __jymfony.StreamBuffer();
        const logger = new BufferingLogger(stream);
        logger.error('foobar', {});

        expect(logger.cleanLogs()).to.be.deep.equal([
            [ LogLevel.ERROR, 'foobar', {} ],
        ]);
        expect(stream.buffer.length).to.be.equal(0);
    });

    it ('finalize should emit all the logs on stream', () => {
        const stream = new __jymfony.StreamBuffer();
        const logger = new BufferingLogger(stream);
        logger.error('foobar', {});
        logger.critical('barbar', {});
        logger.finalize();

        expect(stream.buffer.toString()).to.be.equal('[Error] foobar\n[Critical] barbar\n\n');
    });

    it ('finalize should buffer and count repeated logs', () => {
        const stream = new __jymfony.StreamBuffer();
        const logger = new BufferingLogger(stream);
        logger.error('foobar', {});
        logger.error('foobar', {});
        logger.error('foobar', {});
        logger.critical('barbar', {});
        logger.info('barbar', {});
        logger.info('barbar', {});
        logger.info('barbar', {});
        logger.finalize();

        expect(stream.buffer.toString()).to.be.equal('[Error] foobar (repeated 3 times)\n[Critical] barbar\n[Info] barbar (repeated 3 times)\n\n');
    });
});
