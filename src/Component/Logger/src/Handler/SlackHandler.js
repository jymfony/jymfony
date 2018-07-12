const SocketHandler = Jymfony.Component.Logger.Handler.SocketHandler;
const SlackRecord = Jymfony.Component.Logger.Handler.Slack.SlackRecord;

const querystring = require('querystring');

/**
 * @memberOf Jymfony.Component.Logger.Handler
 */
class SlackHandler extends SocketHandler {
    __construct(options, level = LogLevel.CRITICAL, bubble = true) {
        super.__construct('ssl://slack.com:443', level, bubble);

        this._slackRecord = new SlackRecord(
            options.channel,
            options.username,
            undefined === options.useAttachment ? true : options.useAttachments,
            options.icon,
            undefined === options.shortAttachment ? false : options.shortAttachment,
            undefined === options.includeContextAndExtra ? false : options.includeContextAndExtra,
            options.excludeFields || [],
            this._formatter || this.getDefaultFormatter()
        );

        this._token = options.token;
    }

    /**
     * @inheritdoc
     */
    _generateDataStream(record) {
        const data = this._slackRecord.getSlackData(record);
        data.token = this._token;

        if (data.attachments) {
            data.attachments = JSON.stringify(data.attachments);
        }

        const content = querystring.stringify(data);

        let header = 'POST /api/chat.postMessage HTTP/1.1\r\n';
        header += 'Host: slack.com\r\n';
        header += 'Content-Type: application/x-www-form-urlencoded\r\n';
        header += 'Content-Length: ' + content.length + '\r\n';
        header += 'Connection: keep-alive\r\n';
        header += '\r\n';

        return header + content;
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
}

module.exports = SlackHandler;
