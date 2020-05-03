const AbstractLexer = Jymfony.Component.Lexer.AbstractLexer;
const ValueHolder = Jymfony.Component.DateTime.Parser.ValueHolder;

/**
 * @memberOf Jymfony.Component.DateTime.Parser
 */
export default class Lexer extends AbstractLexer {
    /**
     * @inheritdoc
     */
    getCatchablePatterns() {
        return [
            'now',
            Lexer.DATE_TIME_TERMS,
            'noon|midnight',
            Lexer.MDY_ALTERNATIVE,
            Lexer.MONTH_NAMES,
            Lexer.DAY_NAMES,
            'tomorrow|yesterday|today',
            Lexer.RELATIVE_SIMPLE,
            Lexer.RELATIVE_PLUS_MINUS,
            Lexer.RELATIVE_COMPLEX,
            Lexer.RELATIVE_COMPLEX_2,
            Lexer.RELATIVE_COMPLEX_3,
            'GMT[+-](\\d{3,4}|\\d{1,2}:\\d{2})',
            Lexer.ISO_TIME,
            Lexer.DMY_ALTERNATIVE,
            Lexer.YMD_ALTERNATIVE,
            Lexer.YMD,
            Lexer.YMD_NO_SEPARATOR,
            Lexer.MDY,
            Lexer.DMY,
            Lexer.REGULAR_TIME,
            Lexer.MILITARY_TIME,
            '(tonight|tonite)s?',
            '[a-zA-Z/\\-+]+',
            '@\\d+',
        ];
    }

    /**
     * @inheritdoc
     */
    getNonCatchablePatterns() {
        return [
            '\\s+',
        ];
    }

    /**
     * @inheritdoc
     */
    createValueHolder(value) {
        return new ValueHolder(value);
    }

    /**
     * @inheritdoc
     */
    getType(holder) {
        const value = holder.value.toString();
        let matches;

        switch (true) {
            case null !== value.match(/^\s+$/):
                return Lexer.T_SPACE;

            case 'now' === value:
                return Lexer.T_NOW;

            case 'noon' === value:
                holder.value = '12:00:00';
                return Lexer.T_REGULAR_TIME;

            case 'midnight' === value:
                holder.value = '00:00:00';
                return Lexer.T_REGULAR_TIME;

            case value.match(Lexer.DATE_TIME_TERMS_REGEX):
                return this._lexDateTimeTerms(value);

            case null !== value.match(Lexer.ISO_TIME_REGEX):
                if (! value.startsWith('+') && ! value.startsWith('-')) {
                    holder.value = '+'+holder.value;
                }

                return Lexer.T_ISO_TIME;

            case null !== (matches = value.match(Lexer.DMY_REGEX)):
            case null !== (matches = value.match(Lexer.MDY_REGEX)):
            case null !== (matches = value.match(Lexer.YMD_REGEX)):
            case null !== (matches = value.match(Lexer.YMD_NO_SEPARATOR_REGEX)):
            case null !== (matches = value.match(Lexer.DMY_ALTERNATIVE_REGEX)):
            case null !== (matches = value.match(Lexer.MDY_ALTERNATIVE_REGEX)):
            case null !== (matches = value.match(Lexer.YMD_ALTERNATIVE_REGEX)):
                return this._lexRegularDate(holder, matches);

            case null !== (matches = value.match(Lexer.MILITARY_TIME_REGEX)):
                return this._lexMilitaryTime(holder, matches);

            case null !== (matches = value.match(Lexer.REGULAR_TIME_REGEX)):
                return this._lexRegularTime(holder, matches);

            case 'tomorrow' === value:
            case 'today' === value:
            case 'yesterday' === value:
            case null !== value.match(Lexer.DAY_NAMES_REGEX):
                return this._lexDayName(holder);

            case null !== value.match(Lexer.MONTH_NAMES_REGEX):
                return this._lexMonthName(holder);

            case null !== (matches = value.match(Lexer.RELATIVE_SIMPLE_REGEX)):
                return this._lexRelative('simple', holder, matches);

            case null !== (matches = value.match(Lexer.RELATIVE_PLUS_MINUS_REGEX)):
            case null !== (matches = value.match(Lexer.RELATIVE_COMPLEX_REGEX)):
            case null !== (matches = value.match(Lexer.RELATIVE_COMPLEX_2_REGEX)):
                return this._lexRelative('complex', holder, matches);

            case null !== (matches = value.match(Lexer.RELATIVE_COMPLEX_3_REGEX)):
                return this._lexRelative('complex_count', holder, matches);

            case !! value.match(/^[+-]\d{4,}$/):
                return Lexer.T_SIGNED_YEAR;

            case !! value.match(/^gmt([+-]\d+|$)/i):
                return Lexer.T_GMT;

            case !! value.match(/^[a-zA-Z/]+$/i):
                return Lexer.T_IDENTIFIER;

            case '@' === value[0]:
                return Lexer.T_AT;
        }

        throw new InvalidArgumentException(value);
    }

    /**
     * Returns the correct token number for date term.
     *
     * @param {string} value
     *
     * @returns {int}
     *
     * @private
     */
    _lexDateTimeTerms(value) {
        switch (value[0]) {
            case 's':
                return Lexer.T_SECONDS;

            case 'm':
                return 'i' === value[1] ? Lexer.T_MINUTES : Lexer.T_MONTHS;

            case 'h':
                return Lexer.T_HOURS;

            case 'd':
                return Lexer.T_DAYS;

            case 'w':
                return Lexer.T_WEEKS;

            case 'y':
                return Lexer.T_YEARS;
        }
    }

    /**
     * Converts a regular (with meridian notation) time into a 24 hours time.
     *
     * @param {Jymfony.Component.DateTime.Parser.ValueHolder} holder
     * @param {RegExpMatchArray} matches
     *
     * @returns {int}
     *
     * @private
     */
    _lexRegularTime(holder, matches) {
        let hours = ~~matches[1];
        const minutes = ~~(matches[2] || 0);
        const seconds = ~~(matches[3] || 0);
        const millis = ~~ String(matches[4] || 0).substr(0, 3);

        const meridian = (matches[5] || '').toLowerCase();

        if (meridian.startsWith('p') && 12 !== hours) {
            hours += 12;
        } else if (meridian.startsWith('a') && 12 === hours) {
            hours = 0;
        } else if (meridian.startsWith('in the')) {
            const modifier = matches.groups.in_the_modifier.toLowerCase();
            switch (modifier) {
                case 'evening':
                case 'afternoon':
                    hours += 12 === hours ? 0 : 12;
                    break;
            }
        }

        holder.value = __jymfony.sprintf('%02d:%02d:%02d.%03d', hours, minutes, seconds, millis);
        return Lexer.T_REGULAR_TIME;
    }

    /**
     * Converts a military (without meridian notation) time into a normal time string.
     *
     * @param {Jymfony.Component.DateTime.Parser.ValueHolder} holder
     * @param {RegExpMatchArray} matches
     *
     * @returns {int}
     *
     * @private
     */
    _lexMilitaryTime(holder, matches) {
        const hours = ~~matches[1];
        const minutes = ~~(matches[2] || 0);
        const seconds = ~~(matches[3] || 0);
        const millis = ~~ String(matches[4] || 0).substr(0, 3);

        holder.value = __jymfony.sprintf('%02d:%02d:%02d.%03d', hours, minutes, seconds, millis);
        return Lexer.T_REGULAR_TIME;
    }

    /**
     * Lex a date in Y-m-d, m-d-Y or d/m/Y format.
     *
     * @param {Jymfony.Component.DateTime.Parser.ValueHolder} holder
     * @param {RegExpMatchArray} matches
     *
     * @returns {string}
     *
     * @private
     */
    _lexRegularDate(holder, matches) {
        let years;
        if (matches.groups.year_number) {
            years = ~~matches.groups.year_number;
        } else {
            years = ~~matches.groups.short_year;
            years += 70 < years ? 1900 : 2000;
        }

        const sign = matches.groups.sign || '+';
        const months = undefined !== matches.groups.month_name ?
            this._monthToInt(matches.groups.month_name.toLowerCase()) :
            ~~matches.groups.month_number;
        const days = ~~matches.groups.day_number;

        holder.value = __jymfony.sprintf('%s%04d-%02d-%02d', sign, years, months, days);
        return Lexer.T_REGULAR_DATE;
    }

    /**
     * Converts a day name to its numerical representation.
     *
     * @param {Jymfony.Component.DateTime.Parser.ValueHolder} holder
     *
     * @returns {int}
     *
     * @private
     */
    _lexDayName(holder) {
        const value = holder.value.toLowerCase();

        if ('tomorrow' === value) {
            holder.value = 8;
        } else if ('today' === value) {
            holder.value = 0;
        } else if ('yesterday' === value) {
            holder.value = -1;
        } else {
            holder.value = this._weekDayToInt(value);
        }

        return Lexer.T_DAY_NAME;
    }

    /**
     * Converts a day name to its numerical representation.
     *
     * @param {Jymfony.Component.DateTime.Parser.ValueHolder} holder
     *
     * @returns {int}
     *
     * @private
     */
    _lexMonthName(holder) {
        holder.value = this._monthToInt(holder.value);

        return Lexer.T_MONTH_NAME;
    }

    /**
     * Lex relative date/time specification.
     *
     * @param {"simple"|"complex"|"complex_count"} type
     * @param {Jymfony.Component.DateTime.Parser.ValueHolder} holder
     * @param {RegExpMatchArray} matches
     *
     * @returns {int}
     *
     * @private
     */
    _lexRelative(type, holder, matches) {
        const ret = {
            modifier: undefined,
            relative: undefined,
            time: undefined,
            relativeTo: undefined,
        };

        switch (type) {
            case 'simple': {
                switch (matches.groups.keyword.toLowerCase()) {
                    case 'this': ret.modifier = 0; break;
                    case 'next': ret.modifier = 1; break;
                    case 'last':
                    case 'previous': ret.modifier = -1; break;
                }

                const relative = matches.groups.time;
                let match;
                if ('month' === relative) {
                    ret.relative = Lexer.RELATIVE_MONTHS;
                } else if ('week' === relative) {
                    ret.relative = Lexer.RELATIVE_WEEKS;
                    ret.relativeTo = 'monday';
                } else if ('year' === relative) {
                    ret.relative = Lexer.RELATIVE_YEAR;
                } else if ((match = relative.match(Lexer.MONTH_NAMES_REGEX))) {
                    ret.relative = Lexer.RELATIVE_MONTHS + this._monthToInt(match[0]);
                } else if ((match = relative.match(Lexer.DAY_NAMES_REGEX))) {
                    ret.relative = Lexer.RELATIVE_WEEKDAY + this._weekDayToInt(match[0]);
                }

                const atTime = matches.groups.at_time;
                if (atTime) {
                    const timeHolder = this.createValueHolder(atTime);
                    if ((match = atTime.match(Lexer.REGULAR_TIME_REGEX))) {
                        this._lexRegularTime(timeHolder, match);
                    } else if ((match = atTime.match(Lexer.MILITARY_TIME_REGEX))) {
                        this._lexMilitaryTime(timeHolder, match);
                    }

                    ret.time = timeHolder.value;
                }
            } break;

            case 'complex': {
                const modifier = matches.groups.modifier.toLowerCase();
                let match;

                let unit;
                switch (matches.groups.unit[0]) {
                    case 'y': unit = Lexer.RELATIVE_YEAR; break;
                    case 'm': unit = 'i' === matches.groups.unit[1] ? Lexer.RELATIVE_MINUTES : Lexer.RELATIVE_MONTHS; break;
                    case 'd': unit = Lexer.RELATIVE_DAYS; break;
                    case 'h': unit = Lexer.RELATIVE_HOURS; break;
                    case 's': unit = Lexer.RELATIVE_SECONDS; break;
                    case 'w': unit = Lexer.RELATIVE_WEEKS; break;
                }

                ret.relative = unit;

                switch (true) {
                    case 'in' === modifier:
                    case '+' === modifier:
                    case modifier.startsWith('from'):
                    case modifier.startsWith('after'):
                        ret.modifier = ~~matches.groups.quantity;
                        break;

                    case 'ago' === modifier:
                    case '-' === modifier:
                    case modifier.startsWith('past'):
                    case modifier.startsWith('before'):
                        ret.modifier = -1 * matches.groups.quantity;
                        break;
                }

                if ((match = modifier.match(/^(from|after|before|past)/))) {
                    ret.relativeTo = matches.groups.modifier.substr(match[0].length);
                }
            } break;

            case 'complex_count': {
                const modifier = matches.groups.modifier.toLowerCase();
                const quantity = parseInt(matches.groups.quantity, 10);
                let match, unit;
                const assertQuantityMax = (max) => {
                    if (quantity > max) {
                        throw new InvalidArgumentException('Invalid quantity "'+quantity+'"');
                    }
                };

                switch (true) {
                    case null !== (match = matches.groups.unit.match(Lexer.DAY_NAMES_REGEX)): {
                        assertQuantityMax(5);
                        unit = Lexer.RELATIVE_WEEKDAY;
                        ret.time = this._weekDayToInt(matches.groups.unit);
                    } break;

                    case 'm' === matches.groups.unit[0]: assertQuantityMax(12); unit = Lexer.RELATIVE_MONTHS; break;
                    case 'd' === matches.groups.unit[0]: assertQuantityMax(31); unit = Lexer.RELATIVE_DAYS; break;
                    case 'w' === matches.groups.unit[0]: assertQuantityMax(5); unit = Lexer.RELATIVE_WEEKS; break;
                }

                ret.relative = unit;
                ret.modifier = quantity;

                if ((match = modifier.match(/(in|of)\s+/))) {
                    ret.relativeTo = matches.groups.modifier.substr(match[0].length);
                } else {
                    ret.relativeTo = matches.groups.modifier;
                }
            } break;
        }

        holder.value = ret;

        return Lexer.T_RELATIVE;
    }

    _monthToInt(value) {
        switch (value[0]) {
            case 'j':
                if ('a' === value[1]) {
                    return 1;
                }

                return 'n' === value[2] ? 6 : 7;

            case 'f': return 2;
            case 'm': return 'r' === value[2] ? 3 : 5;
            case 'a': return 'p' === value[1] ? 4 : 8;
            case 's': return 9;
            case 'o': return 10;
            case 'n': return 11;
            case 'd': return 12;
        }
    }

    _weekDayToInt(value) {
        switch (value[0]) {
            case 's': return 'u' === value[1] ? 7 : 6;
            case 'm': return 1;
            case 't': return 'u' === value[1] ? 2 : 4;
            case 'w': return 3;
            case 'f': return 5;
        }
    }
}

Lexer.RELATIVE_COMPLEX = 0;
Lexer.RELATIVE_MONTHS = 100;
Lexer.RELATIVE_WEEKDAY = 200;
Lexer.RELATIVE_YEAR = 300;
Lexer.RELATIVE_MINUTES = 301;
Lexer.RELATIVE_DAYS = 302;
Lexer.RELATIVE_HOURS = 303;
Lexer.RELATIVE_SECONDS = 304;
Lexer.RELATIVE_WEEKS = 305;

Lexer.ISO_TIME = '[+-]?(\\d{4,})-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])[Tt ]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])([+-]\\d{2}:?\\d{2})?';
Lexer.ISO_TIME_REGEX = new RegExp('^'+Lexer.ISO_TIME+'$');
Lexer.DATE_TIME_TERMS = '(sec(ond)?|min(ute)?|hour|hr|day|week|month|year)s?';
Lexer.DATE_TIME_TERMS_REGEX = new RegExp('^'+Lexer.DATE_TIME_TERMS+'$');
Lexer.REGULAR_TIME = '[Tt]?(1[012]|0?[1-9])(?:(?:[:.]([0-5][0-9]))?(?:[:.]([0-5][0-9]))?(?:[:.](\\d+))?(?:\\s?([apAP][.]?[mM]?[.]?|in the (morning|afternoon|evening))))';
Lexer.REGULAR_TIME_REGEX = new RegExp('^[Tt]?(1[012]|0?[1-9])(?:(?:[:.]([0-5][0-9]))?(?:[:.]([0-5][0-9]))?(?:[:.](\\d+))?(?:\\s?([apAP][.]?[mM]?[.]?|in the (?<in_the_modifier>morning|afternoon|evening))))$');
Lexer.MILITARY_TIME = '[Tt]?(1[0-9]|2[0-3]|0?[0-9])[:.]?([0-5][0-9])?(?:[:.]?([0-5][0-9])(?:[:.](\\d+))?)?([+-]\\d{2}:?\\d{2})?';
Lexer.MILITARY_TIME_REGEX = new RegExp('^'+Lexer.MILITARY_TIME+'$');

Lexer.GENERIC_NUMBER = '(1[0-2]|0?[1-9])';
Lexer.DAY_NUMBER = '(1[3-9]|2[0-9]|3[01])';
Lexer.DMY = '('+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+')/'+Lexer.GENERIC_NUMBER+'/(?:\\d{4,}|\\d{2})';
Lexer.DMY_REGEX = new RegExp('^(?<day_number>'+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+')/(?<month_number>'+Lexer.GENERIC_NUMBER+')/((?<year_number>\\d{4,})|(?<short_year>\\d{2}))$');
Lexer.MDY = Lexer.GENERIC_NUMBER+'-('+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+')-(?:\\d{4,}|\\d{2})';
Lexer.MDY_REGEX = new RegExp('^(?<month_number>'+Lexer.GENERIC_NUMBER+')-(?<day_number>'+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+')-((?<year_number>\\d{4,})|(?<short_year>\\d{2}))$');
Lexer.YMD = '[+-]?(?:\\d{4,}|\\d{2})[-/]'+Lexer.GENERIC_NUMBER+'[-/]('+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+')';
Lexer.YMD_REGEX = new RegExp('^(?<sign>[+-])?((?<year_number>\\d{4,})|(?<short_year>\\d{2}))[-/](?<month_number>'+Lexer.GENERIC_NUMBER+')[-/](?<day_number>'+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+')$');
Lexer.YMD_NO_SEPARATOR = '[+-]?(?:\\d{4})(?:1[0-2]|0[1-9])(?:1[0-9]|2[0-9]|3[01]|0[1-9])';
Lexer.YMD_NO_SEPARATOR_REGEX = new RegExp('^(?<sign>[+-])?(?<year_number>\\d{4})(?<month_number>1[0-2]|0[1-9])(?<day_number>1[0-9]|2[0-9]|3[01]|0[1-9])$');

Lexer.DAY_NAMES = 'sun(day)?|mon(day)?|tue(sday)?|wed(nesday)?|thu(rsday)?|fri(day)?|sat(urday)?';
Lexer.DAY_NAMES_REGEX = /^(sun(day)?|mon(day)?|tue(sday)?|wed(nesday)?|thu(rsday)?|fri(day)?|sat(urday)?)$/i;
Lexer.MONTH_NAMES = 'jan(uary|uaries)?|feb(ruary|ruaries)?|mar(ch|ches)?|apr(il)?|may|june?|jul(y|ies)?|aug(ust)?|sep(t)?(ember)?|oct(ober)?|nov(ember)?|dec(ember)?';
Lexer.MONTH_NAMES_REGEX = /^(jan(uary|uaries)?|feb(ruary|ruaries)?|mar(ch|ches)?|apr(il)?|may|june?|jul(y|ies)?|aug(ust)?|sep(t)?(ember)?|oct(ober)?|nov(ember)?|dec(ember)?)$/;

Lexer.YMD_ALTERNATIVE = '[+-]?(?:\\d{4,}|\\d{2})\\s+('+Lexer.MONTH_NAMES+')\\s+('+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+'(?:st|nd|rd|th)?)';
Lexer.YMD_ALTERNATIVE_REGEX = new RegExp('^[+-]?((?<year_number>\\d{4,})|(?<short_year>\\d{2}))\\s+(?<month_name>'+Lexer.MONTH_NAMES+')\\s+(?<day_number>'+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+'(?:st|nd|rd|th)?)$', 'i');
Lexer.MDY_ALTERNATIVE = '('+Lexer.MONTH_NAMES+')\\s+('+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+'(?:st|nd|rd|th)?)\\s+[+-]?(?:\\d{4,}|\\d{2})';
Lexer.MDY_ALTERNATIVE_REGEX = new RegExp('^(?<month_name>'+Lexer.MONTH_NAMES+')\\s+(?<day_number>'+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+'(?:st|nd|rd|th)?)\\s+[+-]?((?<year_number>\\d{4,})|(?<short_year>\\d{2}))$', 'i');
Lexer.DMY_ALTERNATIVE = '('+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+'(?:st|nd|rd|th)?)\\s+('+Lexer.MONTH_NAMES+')\\s+[+-]?(?:\\d{4,}|\\d{2})';
Lexer.DMY_ALTERNATIVE_REGEX = new RegExp('^(?<day_number>'+Lexer.DAY_NUMBER+'|'+Lexer.GENERIC_NUMBER+'(?:st|nd|rd|th)?)\\s+(?<month_name>'+Lexer.MONTH_NAMES+')\\s+[+-]?((?<year_number>\\d{4,})|(?<short_year>\\d{2}))$', 'i');

Lexer.AT_TIME = '(\\s+at\\s+('+Lexer.REGULAR_TIME+'|'+Lexer.MILITARY_TIME+'))';
Lexer.RELATIVE_SIMPLE = '(this|next|last|previous)\\s+(month|year|week|'+Lexer.DAY_NAMES+'|'+Lexer.MONTH_NAMES+')'+Lexer.AT_TIME+'?';
Lexer.RELATIVE_SIMPLE_REGEX = new RegExp('^(?<keyword>this|next|last|previous)\\s+(?<time>month|year|week|'+Lexer.DAY_NAMES+'|'+Lexer.MONTH_NAMES+')(\\s+at\\s+(?<at_time>'+Lexer.REGULAR_TIME+'|'+Lexer.MILITARY_TIME+'))?$');
Lexer.RELATIVE_PLUS_MINUS = '[+-]\\s*\\d+\\s+(years?|months?|days?|hours?|minutes?|seconds?|weeks?)';
Lexer.RELATIVE_PLUS_MINUS_REGEX = /(?<modifier>[+-])\s*(?<quantity>\d+)\s+(?<unit>years?|months?|days?|hours?|minutes?|seconds?|weeks?)/;
Lexer.RELATIVE_COMPLEX = '\\d+\\s+(years?|months?|days?|hours?|minutes?|seconds?|weeks?)\\s+(ago|(past|from|before)\\s+(.+))';
Lexer.RELATIVE_COMPLEX_REGEX = /^(?<quantity>\d+)\s+(?<unit>years?|months?|days?|hours?|minutes?|seconds?|weeks?)\s+(?<modifier>ago|(past|from|before)\s+(.+))$/;
Lexer.RELATIVE_COMPLEX_2 = 'in\\s+\\d+\\s+(years?|months?|days?|hours?|minutes?|seconds?|weeks?)';
Lexer.RELATIVE_COMPLEX_2_REGEX = /^(?<modifier>in)\s+(?<quantity>\d+)\s+(?<unit>years?|months?|days?|hours?|minutes?|seconds?|weeks?)$/;
Lexer.RELATIVE_COMPLEX_3 = '(((?:1|21|31|41|51)(?:st)?|(?:2|22|32|42|52)(?:nd)?|(?:3|23|33|43|53)(?:rd)?|\\d+th)\\s+(day|month|week|'+Lexer.DAY_NAMES+'|'+Lexer.MONTH_NAMES+')\\s+((?:(?:in|of)\\s+)?(.+)))';
Lexer.RELATIVE_COMPLEX_3_REGEX = new RegExp('^((?<quantity>(?:1|21|31)(?:st)?|(?:2|22)(?:nd)?|(?:3|23)(?:rd)?|\\d+th)\\s+(?<unit>day|month|week|'+Lexer.DAY_NAMES+')\\s+(?<modifier>(?:(?:in|of)\\s+)?(.+)))$');

Lexer.T_NOW = 100;
Lexer.T_SPACE = 101;
Lexer.T_SEPARATOR = 102;
Lexer.T_GMT = 104;
Lexer.T_SIGNED_YEAR = 105;
Lexer.T_IDENTIFIER = 106;
Lexer.T_AT = 107;
Lexer.T_SECONDS = 108;
Lexer.T_MINUTES = 109;
Lexer.T_HOURS = 110;
Lexer.T_DAYS = 111;
Lexer.T_WEEKS = 112;
Lexer.T_MONTHS = 113;
Lexer.T_YEARS = 114;
Lexer.T_REGULAR_TIME = 115;
Lexer.T_ISO_TIME = 116;
Lexer.T_REGULAR_DATE = 117;
Lexer.T_DAY_NAME = 118;
Lexer.T_MONTH_NAME = 119;
Lexer.T_RELATIVE = 120;
