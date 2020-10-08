const NormalizerFormatter = Jymfony.Component.Logger.Formatter.NormalizerFormatter;
const LogLevel = Jymfony.Contracts.Logger.LogLevel;

/**
 * @memberOf Jymfony.Component.Logger.Handler.Slack
 */
export default class SlackRecord {
    /**
     * Constructor.
     *
     * @param {string} channel
     * @param {string} username
     * @param {boolean} useAttachment
     * @param {string} userIcon
     * @param {boolean} useShortAttachment
     * @param {boolean} includeContextAndExtra
     * @param {string[]} excludeFields
     * @param {Jymfony.Component.Logger.Formatter.FormatterInterface} formatter
     */
    __construct(channel = undefined, username = undefined, useAttachment = true, userIcon = undefined, useShortAttachment = false, includeContextAndExtra = false, excludeFields = [], formatter = undefined) {
        /**
         * Slack channel (encoded ID or name).
         *
         * @type {string}
         *
         * @private
         */
        this._channel = channel;

        /**
         * Name of the bot.
         *
         * @type {string}
         *
         * @private
         */
        this._username = username;

        /**
         * Whether the message should be added to Slack as an attachment (plain text otherwise).
         *
         * @type {boolean}
         *
         * @private
         */
        this._useAttachment = useAttachment;

        /**
         * User icon (emoji name or url).
         *
         * @type {string}
         *
         * @private
         */
        this._userIcon = userIcon;

        /**
         * Whether to context should be added as short attachment.
         *
         * @type {boolean}
         *
         * @private
         */
        this._useShortAttachment = useShortAttachment;

        /**
         * Whether context and extra should be included.
         *
         * @type {boolean}
         *
         * @private
         */
        this._includeContextAndExtra = includeContextAndExtra;

        /**
         * List of fields to be excluded
         *
         * @type {string[]}
         *
         * @private
         */
        this._excludeFields = excludeFields;

        /**
         * Record formatter.
         *
         * @type {Jymfony.Component.Logger.Formatter.FormatterInterface}
         */
        this.formatter = formatter;

        if (this._includeContextAndExtra) {
            /**
             * @type {Jymfony.Component.Logger.Formatter.NormalizerFormatter}
             *
             * @private
             */
            this._normalizerFormatter = new NormalizerFormatter();
        }
    }

    getSlackData(record) {
        const data = {};
        this._doExcludeFields(record);

        if (this._username) {
            data.username = this._username;
        }

        if (this._channel) {
            data.channel = this._channel;
        }

        const message = (this.formatter && ! this._useAttachment) ? this.formatter.format(record) : record.message;

        if (this._useAttachment) {
            const attachment = {
                fallback: message,
                text: message,
                color: this.getAttachmentColor(record.level),
                fields: [],
                mrkdwn_in: [ 'fields' ],
                ts: record.datetime.timestamp,
            };

            if (this._useShortAttachment) {
                attachment.title = record.level_name;
            } else {
                attachment.title = 'Message';
                attachment.fields.push(this._generateAttachmentField('Level', record.level_name));
            }

            if (this._includeContextAndExtra) {
                for (const key of [ 'context', 'extra' ]) {
                    if (!record[key] || 0 === Object.values(record[key]).length) {
                        continue;
                    }

                    if (this._useShortAttachment) {
                        attachment.fields.push(this._generateAttachmentField(__jymfony.ucfirst(key), record[key]));
                    } else {
                        attachment.fields.push(...this._generateAttachmentFields(record[key]));
                    }
                }
            }

            data.attachments = [ attachment ];
        } else {
            data.text = message;
        }

        if (this._userIcon) {
            if (-1 !== this._userIcon.indexOf('://')) {
                data.icon_url = this._userIcon;
            } else {
                data.icon_emoji = this._userIcon;
            }
        }

        return data;
    }

    /**
     * Gets a Slack message attachment color for the given log level.
     *
     * @param {int} level
     */
    getAttachmentColor(level) {
        switch (true) {
            case level >= LogLevel.ERROR:
                return __self.COLOR_DANGER;

            case level >= LogLevel.WARNING:
                return __self.COLOR_WARNING;

            case level >= LogLevel.INFO:
                return __self.COLOR_GOOD;
        }

        return __self.COLOR_DEFAULT;
    }

    /**
     * Generates attachment field.
     *
     * @param {string} title
     * @param {*} value
     *
     * @returns {Object.<string, *>}
     */
    _generateAttachmentField(title, value) {
        if (! isScalar(value)) {
            value = __jymfony.sprintf('```%s```', JSON.stringify(this._normalizerFormatter.format(value), undefined, 4));
        }

        return {
            title,
            value,
            short: false,
        };
    }

    /**
     * Generates a collection of attachment fields from array
     *
     * @param {Object.<string, *>} data
     *
     * @returns {Array}
     */
    _generateAttachmentFields(data) {
        const fields = [];
        for (const [ key, value ] of __jymfony.getEntries(data)) {
            fields.push(this._generateAttachmentField(key, value));
        }

        return fields;
    }

    /**
     * Filters the record.
     *
     * @param {Object.<string, *>} record
     * @param fields
     *
     * @private
     */
    _doExcludeFields(record, fields = this._excludeFields) {
        if (! record) {
            return;
        }

        for (const field of fields) {
            if (-1 === field.indexOf('.')) {
                delete record[field];
            } else {
                const parts = field.split('.', 2);
                this._doExcludeFields(record[parts[0]], [ parts[1] ]);
            }
        }
    }
}

SlackRecord.COLOR_DANGER = 'danger';
SlackRecord.COLOR_WARNING = 'warning';
SlackRecord.COLOR_GOOD = 'good';
SlackRecord.COLOR_DEFAULT = '#e3e4e6';
