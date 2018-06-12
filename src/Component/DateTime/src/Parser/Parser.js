const InvalidDateTimeStringException = Jymfony.Component.DateTime.Exception.InvalidDateTimeStringException;
const Lexer = Jymfony.Component.DateTime.Parser.Lexer;
const TimeDescriptor = Jymfony.Component.DateTime.Struct.TimeDescriptor;

/**
 * DateTime parser.
 *
 * @memberOf Jymfony.Component.DateTime.Parser
 *
 * @internal
 */
class Parser {
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
        datetime = datetime.trim();
        this._tm = new TimeDescriptor(timezone);
        this._lexer.input = datetime;

        this._timeParsed = false;
        this._dateParsed = false;

        while (this._lexer.moveNext()) {
            const token = this._lexer.token;
            if (Lexer.T_SPACE === token.type) {
                continue;
            }

            if (Lexer.T_SEPARATOR === token.type && 't' === token.value) {
                this._parseTime24HoursNotation();

                continue;
            }

            if (Lexer.T_NUMBER === token.type) {
                const value = token.value;
                if ('0' === value.substr(0, 1) || (
                    (6 === value.length || 4 === value.length) &&
                    (! this._lexer.lookahead || this._lexer.isNextToken(Lexer.T_SPACE))
                )) {
                    this._parseTime24HoursNotation();

                    continue;
                }

                if (23 < value) {
                    this._parseDate();

                    continue;
                }

                if (12 < value) {
                    const separator = this._lexer.lookahead.value;
                    if ('.' === separator || ':' === separator) {
                        this._parseTime24HoursNotation();
                    } else {
                        this._parseDate();
                    }

                    continue;
                }

                if (this._searchForMeridian()) {
                    this._parseTime12HoursNotation();

                    continue;
                } else {
                    const separator = this._lexer.lookahead.value;
                    if ('.' === separator || ':' === separator) {
                        this._parseTime24HoursNotation();
                    } else {
                        this._parseDate();
                    }

                    continue;
                }
            }

            if (Lexer.T_GMT === token.type || Lexer.T_IDENTIFIER === token.type) {
                this._parseTimezone();

                continue;
            }

            if (Lexer.T_SIGNED_YEAR === token.type) {
                if (this._dateParsed) {
                    this._parseTimezone();
                } else {
                    this._parseDate();
                }

                continue;
            }

            if (Lexer.T_AT === token.type) {
                if (! this._lexer.isNextToken(Lexer.T_NUMBER)) {
                    this._syntaxError(Lexer.T_NUMBER, true);
                }

                this._lexer.moveNext(); // T_AT
                this._tm.unixTimestamp = this._lexer.token.value;
                this._timeParsed = true;
                this._dateParsed = true;

                continue;
            }

            this._syntaxError();
        }

        if (this._dateParsed && ! this._timeParsed) {
            this._tm.hour = 0;
            this._tm.minutes = 0;
            this._tm.seconds = 0;
            this._tm.milliseconds = 0;
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
     * Parses a 24-hours notation time string.
     *
     * @private
     */
    _parseTime24HoursNotation() {
        this._timeParsed = true;
        if (Lexer.T_SEPARATOR === this._lexer.token.type) {
            // T or t (24-hours notation)
            this._lexer.moveNext();
        }

        const token = this._lexer.token;
        if (Lexer.T_NUMBER !== token.type) {
            this._syntaxError(Lexer.T_NUMBER);
        }

        let separator;
        switch (token.value.length) {
            case 4:
            case 6:
                // HHMM or HHMMII
                this._tm.hour = token.value.substr(0, 2);
                this._tm.minutes = token.value.substr(2, 2);
                this._tm.seconds = token.value.substr(4, 2) || 0;
                this._tm.milliseconds = 0;

                return;

            case 2:
                this._tm.seconds = 0;
                this._tm.milliseconds = 0;

                separator = this._lexer.lookahead.value;
                if ('.' !== separator && ':' !== separator) {
                    this._syntaxError(Lexer.T_SEPARATOR);
                }

                this._tm.hour = this._lexer.token.value;
                this._lexer.moveNext(); // T_SEPARATOR

                if (! this._lexer.isNextToken(Lexer.T_NUMBER)) {
                    this._syntaxError(Lexer.T_NUMBER, true);
                }

                this._lexer.moveNext();
                this._tm.minutes = this._lexer.token.value;

                if (! this._lexer.lookahead || this._lexer.isNextToken(Lexer.T_SPACE)) {
                    // HH:MM
                    return;
                }

                this._lexer.moveNext(); // T_SEPARATOR
                if (separator !== this._lexer.token.value) {
                    this._syntaxError(Lexer.T_SEPARATOR);
                }

                this._lexer.moveNext();
                if (Lexer.T_NUMBER !== this._lexer.token.type) {
                    this._syntaxError(Lexer.T_NUMBER);
                }

                this._tm.seconds = this._lexer.token.value;
                if (this._lexer.isNextTokenAny([ Lexer.T_IDENTIFIER, Lexer.T_GMT ])) {
                    this._lexer.moveNext();
                    this._parseTimezone();

                    return;
                }

                if (this._lexer.isNextToken(Lexer.T_SEPARATOR) && '.' === this._lexer.lookahead.value) {
                    this._lexer.moveNext(); // T_SEPARATOR
                    this._lexer.moveNext(); // T_NUMBER

                    if (Lexer.T_NUMBER !== this._lexer.token.type) {
                        this._syntaxError(Lexer.T_NUMBER);
                    }

                    this._tm.milliseconds = ~~this._lexer.token.value;
                }

                return;
        }

        this._syntaxError();
    }

    /**
     * Parses a 12-hours notation (am/pm) time string.
     *
     * @private
     */
    _parseTime12HoursNotation() {
        this._timeParsed = true;
        this._tm.minutes = 0;
        this._tm.seconds = 0;
        this._tm.milliseconds = 0;
        this._tm.hour = this._lexer.token.value;

        let separator;
        if (this._lexer.isNextToken(Lexer.T_SEPARATOR)) {
            this._lexer.moveNext();
            separator = this._lexer.token.value;

            if ('.' !== separator && ':' !== separator) {
                this._syntaxError(Lexer.T_SEPARATOR);
            }

            this._lexer.moveNext();
            this._tm.minutes = this._lexer.token.value;
        }

        if (this._lexer.isNextToken(Lexer.T_SEPARATOR)) {
            this._lexer.moveNext();

            if (separator !== this._lexer.token.value) {
                this._syntaxError(Lexer.T_SEPARATOR);
            }

            this._lexer.moveNext();
            this._tm.seconds = this._lexer.token.value;
        }

        if (this._lexer.isNextToken(Lexer.T_SEPARATOR) && ':' === separator && this._lexer.lookahead.value === separator) {
            this._lexer.moveNext(); // T_SEPARATOR

            if (! this._lexer.isNextToken(Lexer.T_NUMBER)) {
                this._syntaxError(Lexer.T_NUMBER, true);
            }

            this._lexer.moveNext();
            this._tm.milliseconds = this._lexer.token.value;
        }

        if (this._lexer.isNextToken(Lexer.T_SPACE)) {
            this._lexer.moveNext();
        }

        if (! this._lexer.isNextToken(Lexer.T_MERIDIAN)) {
            this._syntaxError(Lexer.T_MERIDIAN, true);
        }

        this._lexer.moveNext();
        if ('p' === this._lexer.token.value[0]) {
            this._tm.hour += 12;
        }
    }

    /**
     * Look ahead in the lexer to find a meridian string.
     *
     * @returns {boolean}
     *
     * @private
     */
    _searchForMeridian() {
        let lookahead;
        while (lookahead = this._lexer.peek()) {
            if (':' === lookahead.value || '.' === lookahead.value ||
                lookahead.type === Lexer.T_NUMBER) {

                continue;
            }

            if (lookahead.type === Lexer.T_MERIDIAN) {
                return true;
            }

            if (lookahead.type === Lexer.T_SPACE) {
                return this._lexer.glimpse().type === Lexer.T_MERIDIAN;
            }
        }

        this._lexer.glimpse();

        return false;
    }

    /**
     * Parses a timezone descriptor.
     *
     * @private
     */
    _parseTimezone() {
        this._timeParsed = true;
        let tz = this._lexer.token.value;

        if (this._lexer.token.type === Lexer.T_GMT) {
            tz = this._lexer.token.value;

            if (! this._lexer.isNextToken(Lexer.T_NUMBER)) {
                this._syntaxError(Lexer.T_NUMBER, true);
            }

            this._lexer.moveNext();
            tz += this._lexer.token.value;

            if (2 === this._lexer.token.value.length && this._lexer.isNextToken(Lexer.T_SEPARATOR)) {
                this._lexer.moveNext();
                tz += ':';

                if (! this._lexer.isNextToken(Lexer.T_NUMBER)) {
                    this._syntaxError(Lexer.T_NUMBER, true);
                }

                this._lexer.moveNext();
                tz += this._lexer.token.value;
            }
        } else if (this._lexer.lookahead && '/' === this._lexer.lookahead.value) {
            this._lexer.moveNext(); // T_SEPARATOR
            this._lexer.moveNext(); // T_IDENTIFIER

            if (this._lexer.token.type !== Lexer.T_IDENTIFIER) {
                this._syntaxError(Lexer.T_IDENTIFIER);
            }

            tz += '/' + this._lexer.token.value;
        }

        this._tm.timeZone = Jymfony.Component.DateTime.DateTimeZone.get(tz);
    }

    /**
     * @private
     */
    _parseDate() {
        this._dateParsed = true;
        const token = this._lexer.token;

        if (token.type === Lexer.T_SIGNED_YEAR) {
            this._parseIsoDate();

            return;
        }

        if (token.type === Lexer.T_NUMBER) {
            if (8 === token.value.length) {
                this._tm._year = ~~(token.value.substr(0, 4));
                this._tm.month = token.value.substr(4, 2);
                this._tm.day = token.value.substr(6, 2);

                return;
            }

            if (this._lexer.isNextToken(Lexer.T_SEPARATOR) &&
                ('-' === this._lexer.lookahead.value || '/' === this._lexer.lookahead.value)
            ) {
                this._parseIsoDate();

                return;
            }
        }

        this._syntaxError(Lexer.T_NUMBER);
    }

    /**
     * @private
     */
    _parseIsoDate() {
        if (! this._lexer.isNextToken(Lexer.T_SEPARATOR)) {
            this._syntaxError(Lexer.T_SEPARATOR, true);
        }

        const token = this._lexer.token;
        const separator = this._lexer.lookahead.value;

        if ('/' !== separator && '-' !== separator) {
            this._syntaxError(Lexer.T_SEPARATOR, true);
        }

        if (2 === token.value.length) {
            if (token.type !== Lexer.T_NUMBER) {
                this._syntaxError(Lexer.T_NUMBER);
            }

            this._tm.shortYear = token.value;
        } else if (4 <= token.value.length) {
            let sign = 1;
            let value = token.value;
            if (token.type === Lexer.T_SIGNED_YEAR) {
                sign = '+' === value.substr(0, 1) ? 1 : -1;
                value = value.substr(1);
            }

            this._tm._year = sign * ~~value;
        } else {
            this._syntaxError([ Lexer.T_NUMBER, Lexer.T_SIGNED_YEAR ]);
        }

        this._lexer.moveNext(); // T_SEPARATOR
        this._lexer.moveNext(); // T_NUMBER

        if (this._lexer.token.type !== Lexer.T_NUMBER) {
            this._syntaxError(Lexer.T_NUMBER);
        }

        this._tm.month = this._lexer.token.value;

        if (! this._lexer.lookahead || this._lexer.lookahead.value !== separator) {
            this._syntaxError(Lexer.T_SEPARATOR, true);
        }

        this._lexer.moveNext(); // T_SEPARATOR
        this._lexer.moveNext(); // T_NUMBER

        if (this._lexer.token.type !== Lexer.T_NUMBER) {
            this._syntaxError(Lexer.T_NUMBER);
        }

        this._tm.day = this._lexer.token.value;
    }

    _syntaxError(expected = undefined, moveNext = false) {
        if (moveNext) {
            this._lexer.moveNext();
        }

        let message = `Cannot parse "${this._lexer.input}" near position ${this._lexer.token.position}.`;
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

module.exports = Parser;
