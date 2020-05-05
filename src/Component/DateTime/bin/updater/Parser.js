const DateTimeParser = Jymfony.Component.DateTime.Parser.Parser;
const collator = new Intl.Collator('en');

/**
 * @memberOf App
 */
export default class Parser {
    __construct() {
        /**
         * @type {Object.<string, *>}
         */
        this.abbrevs = {};

        /**
         * @type {*[]}
         */
        this.zones = [];

        /**
         * @type {Object.<string, *>}
         */
        this.rules = {};

        /**
         * @type {Object.<string, string>}
         */
        this.aliases = {};

        /**
         * @type {Jymfony.Component.DateTime.Parser.Parser}
         *
         * @private
         */
        this._dtParser = new DateTimeParser();
    }

    parse(input) {
        const lines = input.replace(/\s*#.*/gm, '')
            .split('\n')
            .filter(line => !! line)
            .filter(line => {
                if (line.startsWith('Rule')) {
                    this._parseRule(line);
                    return false;
                }

                return true;
            })
        ;

        let currentZone = null;

        for (const line of lines) {
            /** @type {RegExpMatchArray} */
            let match = null;
            switch (true) {
                case line.startsWith('Zone'):
                    match = line.match(Parser.FIRST_ZONE_LINE);
                    break;

                case null !== line.match(/^\s+[-+:\d]+/):
                    match = line.match(Parser.ZONE_LINE);
                    break;

                case line.startsWith('Link'):
                    match = line.match(Parser.LINK_LINE);
                    this.aliases[match.groups.link_name] = match.groups.zone_name;
                    continue;
            }

            __assert(null !== match);

            const { zone_name, offset, rule, format } = match.groups;
            if (zone_name) {
                if (null !== currentZone) {
                    this.zones.push(currentZone);
                }

                currentZone = {
                    name: zone_name,
                    rules: [],
                };
            }

            __assert(null !== currentZone);

            const negativeOffset = offset.startsWith('-');
            const offsetTm = this._dtParser.parse('1970-01-01 '+offset.replace(/^[+-]/, ''), 0);
            const offsetTs = (negativeOffset ? -1 : 1) * offsetTm._wallClockTimestamp;

            if ('-' !== rule) {
                if (!this.abbrevs[format]) {
                    this._parseAbbreviation(format, rule, offsetTs);
                }
            }

            let untilTs = Infinity;
            if (match.groups.until) {
                const m = match.groups.until.match(/\d([gwzus])$/i), suffix = null !== m ? m[1] : 'w';
                let until = match.groups.until.replace(new RegExp(suffix+'$', 'i'), '');
                switch (true) {
                    case null !== until.match(/^\d{4}$/):
                        until += '-01-01 00:00:00';
                        break;

                    case null !== until.match(/^\d{4} [a-z]{3}$/i):
                        until += ' 01 00:00:00';
                        break;
                }

                until = until
                    .replace(/(\d{4})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(mon|tue|wed|thu|fri|sat|sun)\s*>=\s*(\d+)/i, '$4 $2 $1 this $3')
                    .replace(/(\d{4})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(last)\s*(mon|tue|wed|thu|fri|sat|sun)/i, '$2 $1 $3 $4')
                    .toLowerCase();

                const tm = this._dtParser.parse(until, 0);

                switch (suffix) {
                    case 's':
                    case 'w':
                        untilTs = tm._wallClockTimestamp - offsetTs;
                        break;
                    // Case 'g':
                    // Case 'z':
                    case 'u':
                        untilTs = tm._wallClockTimestamp;
                        break;
                    default:
                        throw new Error();
                }

                let ruleSet;
                if ('-' !== rule && undefined !== (ruleSet = this.rules[rule])) {
                    let transitions = new Map();
                    for (const year of [ tm._year - 1, tm._year ]) {
                        for (const r of ruleSet.getRulesForYear(year)) {
                            const time = r.getTransitionTime(year, offsetTs);
                            transitions.set(time, r);
                        }
                    }

                    transitions = [ ...transitions.entries() ].sort((a, b) => collator.compare(a[0], b[0]));
                    const currentTime = __jymfony.sprintf('%06d-%02d-%02dT%02d:%02d:%02d', tm._year, tm.month, tm.day, tm.hour, tm.minutes, tm.seconds);

                    let saveRule = null;
                    for (const transition of transitions) {
                        if (1 === collator.compare(currentTime, transition[0])) {
                            saveRule = transition[1];
                        } else {
                            break;
                        }
                    }

                    untilTs -= saveRule.save;
                }
            }

            const ruleObj = { until: untilTs, format };
            currentZone.rules.push('-' === rule ?
                { offset: offsetTs, dst: false, abbrev: format, ...ruleObj } :
                { rule, offset: offsetTs, ...ruleObj });
        }
    }

    _parseAbbreviation(format, rule, offset) {
        if (-1 !== format.indexOf('/')) {
            return;
        }

        if ('-' === rule) {
            this.abbrevs[format] = {
                offset,
                dst: false,
                abbrev: format,
            };

            return;
        }

        if (-1 === format.indexOf('%s')) {
            this.abbrevs[format] = {
                offset,
                dst: format.endsWith('ST'),
                abbrev: format,
            };

            return;
        }

        const rules = this.rules[rule];
        for (const r of rules._rules) {
            const abbrev = __jymfony.sprintf(format, '-' !== r.letters ? r.letters : '');
            if (!!this.abbrevs[abbrev]) {
                continue;
            }

            this.abbrevs[abbrev] = {
                offset: offset + r.save,
                dst: 0 !== r.save,
                abbrev,
            };
        }
    }

    _parseRule(line) {
        const match = line.match(Parser.RULE_LINE);
        __assert(null !== match);

        let { rule_name, from_year, to_year, in_month, on, at, save, letter } = match.groups;
        this.rules[rule_name] = this.rules[rule_name] || new Jymfony.Component.DateTime.Internal.RuleSet();

        if ('min' === from_year) {
            from_year = -Infinity;
        } else {
            from_year = ~~from_year;
        }

        if ('only' === to_year) {
            to_year = from_year;
        } else if ('max' === to_year) {
            to_year = Infinity;
        } else {
            to_year = ~~to_year;
        }

        in_month = this._monthToInt(in_month.toLowerCase());

        const negative = save.startsWith('-');
        const saveTm = this._dtParser.parse('1970-01-01 '+save.replace(/^[+-]/, ''), 0);
        save = (negative ? -1 : 1) * saveTm._wallClockTimestamp;

        on = on
            .replace(/(mon|tue|wed|thu|fri|sat|sun)\s*>=\s*(\d+)/i, '$2 %s this $1')
            .replace(/(last)\s*(mon|tue|wed|thu|fri|sat|sun)/i, '$1 $2 %s')
            .toLowerCase();

        this.rules[rule_name].push(new Jymfony.Component.DateTime.Internal.Rule(from_year, to_year, in_month, on, at, save, letter));
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
}

Parser.FIRST_ZONE_LINE = /Zone\s+(?<zone_name>[a-z\/+\-_0-9]+)\s+(?<offset>[^\s]+)\s+(?<rule>[^\s]+)\s+(?<format>[^\s]+)(?:\s+(?<until>.+))?$/i;
Parser.ZONE_LINE = /\s+(?<offset>[^\s]+)\s+(?<rule>[^\s]+)\s+(?<format>[^\s]+)(\s+(?<until>.+))?$/;
Parser.RULE_LINE = /Rule\s+(?<rule_name>[a-z\/\-_]+)\s+(?<from_year>\d{4}|min)\s+(?<to_year>(?:\d{4}|only|max))\s+(?:[^\s]+)\s+(?<in_month>[a-z]{3})\s+(?<on>[^\s]+)\s+(?<at>[^\s]+)\s+(?<save>[^\s]+)\s+(?<letter>.+)\s*$/i;
Parser.LINK_LINE = /Link\s+(?<zone_name>[a-z\/+\-_0-9]+)\s+(?<link_name>[a-z\/+\-_0-9]+)/i;
