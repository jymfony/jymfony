const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;
const NormalizerFormatter = Jymfony.Component.Logger.Formatter.NormalizerFormatter;
const LogLevel = Jymfony.Component.Logger.LogLevel;

const util = require('util');

const levelColorMap = {
    [LogLevel.DEBUG]: 'fg=white',
    [LogLevel.INFO]: 'fg=green',
    [LogLevel.NOTICE]: 'fg=blue',
    [LogLevel.WARNING]: 'fg=cyan',
    [LogLevel.ERROR]: 'fg=yellow',
    [LogLevel.CRITICAL]: 'fg=red',
    [LogLevel.ALERT]: 'fg=red',
    [LogLevel.EMERGENCY]: 'fg=white;bg=red',
};

/**
 * @memberOf Jymfony.Component.Logger.Formatter
 */
class ConsoleFormatter extends NormalizerFormatter {
    /**
     * Constructor.
     *
     * @param {Object} [options = {}]
     */
    __construct(options = {}) {
        this._options = Object.assign({}, {
            format: ConsoleFormatter.SIMPLE_FORMAT,
            date_format: NormalizerFormatter.SIMPLE_DATE,
            colors: true,
            multiline: false,
        }, options);

        super.__construct(this._options.date_format);
    }

    /**
     * @inheritdoc
     */
    format(record) {
        const levelColor = levelColorMap[record.level];
        record = this._replacePlaceHolder(record);

        let context, extra;
        context = ' ' + util.inspect(record.context);
        extra = ' ' + util.inspect(record.extra);

        if (! this._options.multiline) {
            context = context.replace('\n', ' ');
            extra = extra.replace('\n', ' ');
        }

        return __jymfony.strtr(this._options.format, {
            '%datetime%': this._normalize(record.datetime),
            '%start_tag%': '<' + levelColor + '>',
            '%level_name%': __jymfony.sprintf('%-9s', record.level_name),
            '%end_tag%': '</>',
            '%channel%': record.channel,
            '%message%': record.message,
            '%context%': context,
            '%extra%': extra,
        });
    }

    /**
     * @param {Object} record
     *
     * @returns {Object}
     *
     * @private
     */
    _replacePlaceHolder(record) {
        const message = record.message;

        if (-1 === message.indexOf('{')) {
            return record;
        }

        const context = record.context;
        const replacements = {};

        for (let [ k, v ] of __jymfony.getEntries(context)) {
            // Remove quotes added by the dumper around string.
            v = __jymfony.trim(util.inspect(v), '"');
            v = OutputFormatter.escape(v);
            replacements['{' + k + '}'] = '<comment>' + v + '</>';
        }

        record.message = __jymfony.strtr(message, replacements);

        return record;
    }
}

ConsoleFormatter.SIMPLE_FORMAT = '%datetime% %start_tag%%level_name%%end_tag% <comment>[%channel%]</> %message%%context%%extra%\n';

module.exports = ConsoleFormatter;
