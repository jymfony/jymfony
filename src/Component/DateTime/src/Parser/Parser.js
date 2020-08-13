const InvalidDateTimeStringException = Jymfony.Component.DateTime.Exception.InvalidDateTimeStringException;
const Lexer = Jymfony.Component.DateTime.Parser.Lexer;
const TimeDescriptor = Jymfony.Component.DateTime.Struct.TimeDescriptor;

const DATE_REGEX = /^[-+](\d{4,})-(\d{2})-(\d{2})/;
const TIME_REGEX = /^(\d{2}):(\d{2}):(\d{2})(?:.(\d+))?([+-]\d{2}:?\d{2})?/;

/**
 * DateTime parser.
 *
 * @memberOf Jymfony.Component.DateTime.Parser
 *
 * @internal
 */
export default class Parser {
    /**
     * Constructor.
     */
    __construct() {
        /**
         * @type {Jymfony.Component.DateTime.Parser.Lexer}
         *
         * @private
         */
        this._lexer = new Lexer();

        /**
         * @type {Jymfony.Component.DateTime.Struct.TimeDescriptor|undefined}
         *
         * @private
         */
        this._tm = undefined;
    }

    /**
     * Parses a datetime string and returns a descriptor object
     *
     * @param {string} datetime
     * @param {string|undefined} [timezone]
     *
     * @returns {Jymfony.Component.DateTime.Struct.TimeDescriptor}
     *
     * @throws {InvalidDateTimeStringException}
     */
    parse(datetime, timezone = undefined) {
        datetime = __jymfony.trim(datetime);
        this._tm = new TimeDescriptor(timezone);
        this._lexer.input = datetime;

        while (this._lexer.moveNext()) {
            const token = this._lexer.token;

            switch (token.type) {
                case Lexer.T_ISO_TIME:
                    this._parseIsoTime();
                    break;

                case Lexer.T_REGULAR_TIME:
                    this._parseTime(token.value);
                    break;

                case Lexer.T_REGULAR_DATE:
                    this._parseDate(token.value);
                    break;

                case Lexer.T_IDENTIFIER:
                case Lexer.T_GMT:
                    this._parseTimezone();
                    break;

                case Lexer.T_AT:
                    this._parseAtTimestamp(token.value);
                    break;

                case Lexer.T_NOW:
                    this._parseNow();
                    break;

                case Lexer.T_DAY_NAME:
                    this._parseDayName(token.value);
                    break;

                case Lexer.T_MONTH_NAME:
                    this._parseMonthName(token.value);
                    break;

                case Lexer.T_RELATIVE:
                    if (0 === token.index && ! token.value.relativeTo) {
                        token.value.relativeTo = 'now';
                    }

                    this._parseRelative(token.value);
                    break;

                default:
                    this._syntaxError();
            }
        }

        if (! this._tm.valid) {
            throw new InvalidDateTimeStringException(datetime + ' is not a valid datetime');
        }

        this._tm._makeTime();
        this._tm._updateTime();
        return this._tm;
    }

    /**
     * Parse the tz correction string and return the offset in seconds.
     * Returns undefined if correction is not valid.
     *
     * @param {string} correction
     *
     * @returns {undefined|int}
     */
    static parseTzCorrection(correction) {
        if ('UTC' === correction) {
            return 0;
        }

        const regex = /(?:GMT|UTC)?([+-])(0?[0-9]|1[0-2]):?([0-5][0-9])?/;

        correction = correction.trim();
        const matches = correction.match(regex);

        if (null === matches) {
            return undefined;
        }

        const sign = '+' === matches[1] ? +1 : -1;
        const hours = ~~matches[2];
        const minutes = ~~(matches[3] || 0);

        return sign * (hours * 3600 + minutes * 60);
    }

    /**
     * Parses a timezone descriptor.
     *
     * @private
     */
    _parseTimezone() {
        const tz = this._lexer.token.value;
        this._tm.timeZone = Jymfony.Component.DateTime.DateTimeZone.get(tz);
    }

    _parseIsoTime() {
        let value = this._lexer.token.value;

        value = value.substr(this._parseDate(value) + 1);
        this._parseTime(value);
    }

    _parseDate(value) {
        const matches = value.match(DATE_REGEX);

        const sign = '-' === value[0] ? -1 : 1;
        this._tm._year = sign * ~~matches[1];
        this._tm.month = matches[2];
        this._tm.day = matches[3];

        return matches[0].length;
    }

    _parseTime(value) {
        const matches = value.match(TIME_REGEX);
        const hour = ~~matches[1];

        if (24 === hour) {
            this._tm.hour = 0;
            this._tm._doAddDays(1);
        } else {
            this._tm.hour = ~~matches[1];
        }

        this._tm.minutes = ~~matches[2];
        this._tm.seconds = ~~matches[3];
        this._tm.milliseconds = ~~ String(matches[4] || 0).substr(0, 3);

        if (! this._lexer.lookahead) {
            return;
        }

        const shouldParseTimezone = () => {
            if (Lexer.T_IDENTIFIER === this._lexer.lookahead.type || Lexer.T_GMT === this._lexer.lookahead.type) {
                return true;
            }

            if (Lexer.T_SIGNED_YEAR === this._lexer.lookahead.type) {
                const value = this._lexer.lookahead.value;
                const hours = ~~(value.substr(1, 2));

                return '+' === value[0] && 14 >= hours || '-' === value[0] && 12 >= hours;
            }

            return false;
        };

        if (shouldParseTimezone()) {
            this._lexer.moveNext();
            this._parseTimezone();
        }
    }

    _parseAtTimestamp(value) {
        this._tm.unixTimestamp = value.substr(1);
    }

    _parseNow() {
        const d = new Date();
        this._tm.unixTimestamp = ~~(d.getTime() / 1000);
    }

    _parseDayName(value) {
        if (8 === value) {
            this._tm._doAddDays(1);
        } else if (-1 === value) {
            this._tm._doAddDays(-1);
        } else if (0 === value) {
            // Do nothing.
        } else if (this._tm.weekDay > value) {
            const diff = this._tm.weekDay - value;
            this._tm._doAddDays(7 - diff);
        } else if (value > this._tm.weekDay) {
            const diff = value - this._tm.weekDay;
            this._tm._doAddDays(diff);
        }
    }

    _parseMonthName(value) {
        if (this._tm.month > value) {
            const diff = this._tm.month - value;
            this._tm._doAddMonths(12 - diff);
        } else if (value > this._tm.month) {
            const diff = value - this._tm.month;
            this._tm._doAddMonths(diff);
        }
    }

    _parseRelative(value) {
        if (value.relativeTo) {
            this._tm = new Parser().parse(value.relativeTo, this._tm.timeZone);
        }

        switch (true) {
            case value.relative >= Lexer.RELATIVE_MONTHS && value.relative < Lexer.RELATIVE_WEEKDAY:
                this._relativeMonth(value);
                break;

            case value.relative >= Lexer.RELATIVE_WEEKDAY && value.relative < Lexer.RELATIVE_YEAR:
                this._relativeWeekday(value);
                break;

            case value.relative === Lexer.RELATIVE_YEAR:
                this._tm._year += value.modifier;
                break;

            case value.relative === Lexer.RELATIVE_MINUTES:
                this._tm._addSeconds(value.modifier * 60);
                break;

            case value.relative === Lexer.RELATIVE_HOURS:
                this._tm._addSeconds(value.modifier * 3600);
                break;

            case value.relative === Lexer.RELATIVE_SECONDS:
                this._tm._addSeconds(value.modifier);
                break;

            case value.relative === Lexer.RELATIVE_DAYS:
                this._tm._doAddDays(value.modifier);
                break;

            case value.relative === Lexer.RELATIVE_WEEKS:
                this._tm._doAddDays(value.modifier * 7);
                break;
        }

        if (value.time) {
            this._parseTime(value.time);
        }
    }

    _relativeMonth(value) {
        if (Lexer.RELATIVE_MONTHS === value.relative) {
            this._tm._doAddMonths(value.modifier);
            return;
        }

        const currentMonth = this._tm.month;
        const month = value.relative - Lexer.RELATIVE_MONTHS;
        if (currentMonth === month) {
            switch (value.modifier) {
                case 1:
                case -1: this._tm._doAddYears(value.modifier); break;
            }

            return;
        }

        if (-1 === value.modifier) {
            this._tm._doAddYears(-1);
        }

        this._parseMonthName(month);
    }

    _relativeWeekday(value) {
        if (Lexer.RELATIVE_WEEKDAY === value.relative) {
            this._tm.day = 1;

            if (-100 === value.modifier) {
                this._tm._doAddMonths(1);
                this._tm._doAddDays(-1);
                while (this._tm.weekDay !== value.time) {
                    this._tm._doAddDays(-1);
                }
            } else {
                const firstDoW = this._tm.weekDay;
                let diff = value.time - firstDoW;
                if (0 > diff) {
                    diff += 7;
                }

                this._tm._doAddDays(diff + (value.modifier - 1) * 7);
            }

            value.time = undefined;
            return;
        }

        if (-1 === value.modifier) {
            this._tm._doAddDays(-7);
        }

        this._parseDayName(value.relative - Lexer.RELATIVE_WEEKDAY);
    }

    _syntaxError(expected = undefined, moveNext = false) {
        if (moveNext) {
            this._lexer.moveNext();
        }

        const position = this._lexer.token ? this._lexer.token.position : 'EOF';
        let message = `Cannot parse "${this._lexer.input}" near position ${position}.`;
        if (expected) {
            if (! isArray(expected)) {
                expected = [ expected ];
            }

            expected = expected.map(V => this._lexer.getLiteral(V)).join(' or ');
            message += ` Expected ${expected}, found "${this._lexer.token.value}"`;
        }

        throw new InvalidDateTimeStringException(message);
    }
}
