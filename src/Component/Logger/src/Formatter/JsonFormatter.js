const DateTime = Jymfony.Component.DateTime.DateTime;
const DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
const NormalizerFormatter = Jymfony.Component.Logger.Formatter.NormalizerFormatter;

/**
 * @memberOf Jymfony.Component.Logger.Formatter
 */
export default class JsonFormatter extends NormalizerFormatter {
    /**
     * @inheritdoc
     */
    __construct() {
        super.__construct(NormalizerFormatter.SIMPLE_DATE);
    }

    /**
     * @inheritdoc
     */
    format(record) {
        return JSON.stringify(this._normalize(record)) + '\n';
    }

    /**
     * @inheritdoc
     */
    _normalize(record, depth = 0) {
        if (isNumber(record)) {
            if (! Number.isFinite(record)) {
                return (0 < record ? '' : '-') + 'INF';
            }

            if (record !== record) {
                return 'NaN';
            }
        }

        if (isArray(record)) {
            return record.map(v => this._normalize(v, depth + 1));
        }

        if (isObjectLiteral(record)) {
            const normalized = {};
            let count = 0;
            for (const [ key, value ] of __jymfony.getEntries(record)) {
                if (1000 < ++count) {
                    normalized['...'] = 'Over 1000 entries. Aborting normalization...';
                    break;
                }

                normalized[key] = this._normalize(value, depth + 1);
            }

            return normalized;
        }

        if (record instanceof Date) {
            record = new DateTime(record);
        }

        if (record instanceof DateTimeInterface) {
            return this._formatDate(record);
        }

        if (isObject(record)) {
            if (record instanceof Error) {
                return this._normalizeError(record, depth);
            }

            const reflClass = new ReflectionClass(record);
            let value;
            if (reflClass.hasMethod('toString')) {
                value = record.toString();
            } else {
                const encoded = JSON.stringify(record);
                value = JSON.parse(encoded);
            }

            return { [reflClass.name]: value };
        }

        return record;
    }
}
