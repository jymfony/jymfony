const AbstractProcessingHandler = Jymfony.Component.Logger.Handler.AbstractProcessingHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;
const SlackRecord = Jymfony.Component.Logger.Handler.Slack.SlackRecord;

const https = require('https');
const url = require('url');

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class SlackWebhookHandler extends AbstractProcessingHandler {
    /**
     * Constructor.
     *
     * @param {Object.<string, *>} options
     * @param {int} [level = LogLevel.CRITICAL]
     * @param {boolean} [bubble = true]
     */
    __construct(options, level = LogLevel.CRITICAL, bubble = true) {
        super.__construct(level, bubble);

        /**
         * @type {Jymfony.Component.Logger.Handler.Slack.SlackRecord}
         * @private
         */
        this._slackRecord = new SlackRecord(
            options.channel,
            options.username,
            undefined === options.useAttachment ? true : options.useAttachment,
            options.icon,
            undefined === options.shortAttachment ? false : options.shortAttachment,
            undefined === options.includeContextAndExtra ? false : options.includeContextAndExtra,
            options.excludeFields || [],
            this._formatter || this.getDefaultFormatter()
        );

        this._webhookUrl = url.parse(options.webhookUrl);
    }

    /**
     * @inheritdoc
     */
    set formatter(formatter) {
        this._slackRecord.formatter = formatter;
    }

    /**
     * @inheritdoc
     */
    get formatter() {
        return this._slackRecord.formatter;
    }

    /**
     * @inheritdoc
     */
    _write(record) {
        const data = JSON.stringify(this._slackRecord.getSlackData(record));
        const obj = Object.assign({}, this._webhookUrl);
        obj.method = 'POST';
        obj.headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
        };

        const req = https.request(obj);
        req.write(data);
        req.end();
    }
}

module.exports = SlackWebhookHandler;
