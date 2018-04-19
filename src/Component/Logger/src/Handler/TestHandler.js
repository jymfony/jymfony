const AbstractProcessingHandler = Jymfony.Component.Logger.Handler.AbstractProcessingHandler;
const LogLevel = Jymfony.Component.Logger.LogLevel;

/**
 * Used for testing purposes.
 * It records all records and gives you access to them for verification.
 *
 * @memberOf Jymfony.Component.Logger.Handler
 */
class TestHandler extends AbstractProcessingHandler {
    __construct(level = LogLevel.DEBUG, bubble = true) {
        super.__construct(level, bubble);

        /**
         * @type {Object[]}
         *
         * @protected
         */
        this._records = [];

        /**
         * @type {Object<int, Object[]>}
         *
         * @protected
         */
        this._recordsByLevel = {};

        return new Proxy(this, {
            get: (target, key) => {
                if (Reflect.has(this, key)) {
                    return Reflect.get(target, key);
                }

                const matches = key.match(/(.*)(Debug|Info|Notice|Warning|Error|Critical|Alert|Emergency)(.*)/);
                if (matches) {
                    const genericMethod = matches[1] + ('Records' !== matches[3] ? 'Record' : '') + matches[3];

                    const level = LogLevel[matches[2].toUpperCase()];
                    if (this[genericMethod]) {
                        return (...args) => {
                            return this[genericMethod](...args, level);
                        };
                    }
                }

                throw new BadMethodCallException('Undefined property ' + ReflectionClass.getClassName(this) + '.' + key);
            },
        });
    }

    /**
     * Gets all the registered records.
     *
     * @returns {Object[]}
     */
    get records() {
        return [ ...this._records ];
    }

    /**
     * Clears out all the recorded records.
     */
    clear() {
        this._records = [];
        this._recordsByLevel = {};
    }

    /**
     * Checks whether we have at least one record for the given level
     *
     * @param level
     *
     * @returns {boolean}
     */
    hasRecords(level) {
        return undefined !== this._recordsByLevel && 0 < this._recordsByLevel[level].length;
    }

    /**
     * Whether a record with the same message has been recorded.
     *
     * @param {string|Object} record
     * @param {number} level
     *
     * @returns {boolean}
     */
    hasRecord(record, level) {
        if (isObjectLiteral(record)) {
            record = record.message;
        }

        return this.hasRecordThatPasses((rec) => {
            return rec.message === record;
        }, level);
    }

    /**
     * Whether a record in which the given message is contained has been recorded.
     *
     * @param {string} message
     * @param {number} level
     *
     * @returns {boolean}
     */
    hasRecordThatContains(message, level) {
        return this.hasRecordThatPasses((rec) => {
            return -1 !== rec.message.indexOf(message);
        }, level);
    }

    /**
     * Whether a record with message that matches the given regex has been recorded.
     *
     * @param {RegExp} regex
     * @param {number} level
     *
     * @returns {*}
     */
    hasRecordThatMatches(regex, level) {
        return this.hasRecordThatPasses((rec) => {
            return regex.test(rec.message);
        }, level);
    }

    /**
     * Checks whether a recorded record matches the given predicate.
     *
     * @param {Function} predicate
     * @param {number} level
     *
     * @return {boolean}
     */
    hasRecordThatPasses(predicate, level) {
        if (! isFunction(predicate)) {
            throw new InvalidArgumentException('Expected a Function for hasRecordThatPasses');
        }

        if (undefined === this._recordsByLevel[level]) {
            return false;
        }

        for (const [ i, rec ] of __jmfony.getEntries(this._recordsByLevel[level])) {
            if (predicate(rec, i)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @inheritDoc
     */
    _write(record) {
        if (undefined === this._recordsByLevel[record.level]) {
            this._recordsByLevel[record.level] = [];
        }

        this._recordsByLevel[record.level].push(record);
        this._records.push(record);
    }
}

module.exports = TestHandler;
