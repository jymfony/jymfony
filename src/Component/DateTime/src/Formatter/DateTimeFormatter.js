const DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;
const TimeDescriptor = Jymfony.Component.DateTime.Struct.TimeDescriptor;

const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
const short_months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
const dayOfWeek = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
const daySuffix = n => {
    switch (n) {
        case 1:
        case 21:
        case 31:
            return 'st';

        case 2:
        case 22:
            return 'nd';

        case 3:
        case 23:
            return 'rd';

        default:
            return 'th';
    }
};

/**
 * @memberOf Jymfony.Component.DateTime.Formatter
 */
class DateTimeFormatter {
    /**
     * @param {Jymfony.Component.DateTime.DateTime} datetime
     * @param {string} format
     */
    static format(datetime, format) {
        const fmt = format.split('');
        const tm = datetime._tm;
        let result = '';

        for (let i = 0; i < fmt.length; ++i) {
            const cur = fmt[i];
            switch (cur) {
                case '\\':
                    ++i;
                    result += (fmt[i] || '');
                    break;

                case 'D':
                    // Mon-Sun
                case 'l': {
                    // Monday-Sunday
                    const dow = dayOfWeek[tm.weekDay % 7];
                    result += 'D' === cur ? dow.substr(0, 3) : dow;
                    break;
                }

                case 'd':
                    // 01-31
                case 'j':
                    // 1-31
                    if ('d' === cur && 10 > tm.day) {
                        result += '0';
                    }

                    result += tm.day;
                    break;

                case 'N':
                    // 1 (mon) - 7 (sun)
                    result += tm.weekDay;
                    break;

                case 'w':
                    // 0 (sun) - 6 (sat)
                    result += tm.weekDay % 7;
                    break;

                case 'S':
                    // St, nd, rd, th
                    result += daySuffix(tm.day);
                    break;

                case 'z':
                    // 0-365
                    result += tm.yearDay;
                    break;

                case 'W':
                    result += tm.isoWeekNumber;
                    break;

                /* Months */
                case 'F':
                    // January - December
                case 'M':
                    // Jan - Dec
                    result += 'M' === cur ? months[tm.month - 1] : months[tm.month - 1].substr(0, 3);
                    break;

                case 'n':
                    // 1 - 12
                case 'm':
                    // 01 - 12
                    if ('m' === cur && 10 > tm.month) {
                        result += '0';
                    }

                    result += tm.month;
                    break;

                case 't':
                    // Number of days in month (28/31)
                    result += tm.daysInMonth;
                    break;

                /* Years */
                case 'L':
                    // Is leap? (0/1)
                    result += tm.leap ? '1' : '0';
                    break;

                case 'o':
                    // ISO8601 week-numbering _year.
                    result += tm.isoYear;
                    break;

                case 'Y':
                    // Year (1999-2003)
                    result += tm._year;
                    break;

                case 'y':
                    // Year (99-03)
                    result += ('' + tm._year).substr(2, 2);
                    break;

                /* Time */
                case 'a':
                    // Am-pm
                    result += tm.meridian;
                    break;

                case 'A':
                    // AM-PM
                    result += tm.meridian.toUpperCase();
                    break;

                case 'B':
                    // Swatch internet time
                    result += tm.swatchInternetTime;
                    break;

                case 'g':
                    // Hours 1 - 12
                case 'h': {
                    // Hours 01 - 12
                    let hrs = tm.hour % 12;
                    if (0 === hrs) {
                        hrs = 12;
                    }

                    if ('h' === cur && 10 > hrs) {
                        result += '0';
                    }

                    result += '' + hrs;
                    break;
                }

                case 'G':
                    // Hours 0 - 23
                case 'H':
                    // Hours 00 - 23
                    if ('H' === cur && 10 > tm.hour) {
                        result += '0';
                    }

                    result += '' + tm.hour;
                    break;

                case 'i':
                    // Minutes 00 - 59
                    result += ('00' + tm.minutes).slice(-2);
                    break;

                case 's':
                    // Seconds 00 - 59
                    result += ('00' + tm.seconds).slice(-2);
                    break;

                case 'v':
                    // Milliseconds
                    result += ('000' + tm.milliseconds).slice(-3);
                    break;

                case 'e':
                    // Timezone
                    result += tm.timeZone.name;
                    break;

                case 'I':
                    // DST (1/0)
                    result += tm.timeZone.isDST(datetime) ? '1' : '0';
                    break;

                case 'O':
                    // Difference to GMT +0200
                case 'P': {
                    // Difference to GMT +02:00
                    const offset = tm.timeZone.getOffset(datetime);
                    result += 0 > offset ? '-' : '+';
                    result += ('00' + ~~(offset / 3600)).slice(-2);
                    result += 'P' === cur ? ':' : '';
                    result += ('00' + ~~(offset % 3600)).slice(-2);
                    break;
                }

                case 'T':
                    // Timezone abbrev
                    result += tm.timeZone.getAbbrev(datetime);
                    break;

                case 'Z':
                    // Timezone offset in seconds
                    result += '' + (tm.timeZone.getOffset(datetime) || 0);
                    break;

                case 'U':
                    // Unix timestamp
                    result += '' + tm.unixTimestamp;
                    break;

                default:
                    result += cur;
                    break;
            }
        }

        return result;
    }

    static parse(format, time) {
        const formatRegexp = format.replace(/(\\.|.)/g, (cur) => {
            if ('\\' === cur[0]) {
                return __jymfony.regex_quote(cur);
            }

            switch (cur) {
                case 'D':
                    return '(?<short_day>\\w{3})';
                case 'l':
                    return '(?<week_day>\\w+)';
                case 'N':
                    return '(?<num_week_day>\\d{2})';
                case 'w':
                    return '(?<num_week_day_minus_one>\\d{2})';
                case 'S':
                    return '(?<day_suffix>\\w{2})';
                case 'W':
                    return '(?<iso_week_number>\\d{2})';
                case 't':
                    return '(?<days_in_month>\\d{2})';
                case 'L':
                    return '(?<leap_year>\\d)';
                case 'o':
                    return '(?<iso_year>\\d{4})';
                case 'B':
                    return '(?<swatch_internet_time>\\d+)';
                case 'I':
                    return '(?<is_dst>\\d)';

                case 'd':
                    return '(?<day>\\d{2})';
                case 'j':
                    return '(?<day>\\d{1,2})';
                case 'z':
                    return '(?<year_day>\\d{2})';

                case 'F':
                    return '(?<literal_month>\\w+)';
                case 'M':
                    return '(?<short_month>\\w{3})';
                case 'n':
                    return '(?<month>\\d{1,2})';
                case 'm':
                    return '(?<month>\\d{2})';

                case 'Y':
                    return '(?<year>\\d{4})';
                case 'y':
                    return '(?<short_year>\\w{2})';

                case 'a':
                case 'A':
                    return '(?<meridian>\\w{2})';

                case 'g':
                    return '(?<mid_hours>\\d{1,2})';
                case 'h':
                    return '(?<mid_hours>\\d{2})';
                case 'G':
                    return '(?<hours>\\d{1,2})';
                case 'H':
                    return '(?<hours>\\d{2})';

                case 'i':
                    return '(?<minutes>\\d{2})';
                case 's':
                    return '(?<seconds>\\d{2})';
                case 'v':
                    return '(?<milliseconds>\\d{3})';

                case 'e':
                case 'T':
                    return '(?<timezone>\\w+)';
                case 'O':
                case 'P':
                    return '(?<timezone>(?:GMT|\\d{2}:?\\d{2}))';
                case 'Z':
                    return '(?<timezone>\\d{2}:?\\{2})';
                case 'U':
                    return '(?<timestamp>\\d+)';

                default:
                    return cur;
            }
        });

        const matches = (new RegExp(formatRegexp)).exec(time);
        if (! matches) {
            throw new RuntimeException('Unparsable date time');
        }

        const desc = new TimeDescriptor(matches.groups.timezone ? DateTimeZone.get(matches.groups.timezone) : undefined);
        if (matches.groups.timestamp) {
            desc.unixTimestamp = ~~matches.groups.timestamp;

            return desc;
        }

        const day = ~~(matches.groups.day || 1);

        let month = 1;
        if (matches.groups.month) {
            month = ~~matches.groups.month;
        } else if (matches.groups.literal_month) {
            month = months.indexOf(matches.groups.literal_month);
            if (-1 === month) {
                throw new RuntimeException(__jymfony.sprintf('Unknown month "%s"', matches.groups.literal_month));
            }

            month++;
        } else if (matches.groups.short_month) {
            month = short_months.indexOf(matches.groups.short_month);
            if (-1 === month) {
                throw new RuntimeException(__jymfony.sprintf('Unknown month "%s"', matches.groups.short_month));
            }

            month++;
        }

        let year = 1970;
        if (matches.groups.year) {
            year = ~~matches.groups.year;
        } else if (matches.groups.short_year) {
            year = ~~matches.groups.short_year;
            year += 30 < year ? 1900 : 2000;
        }

        let hours = 0;
        if (matches.groups.mid_hours) {
            hours = ~~matches.groups.mid_hours;
            if (matches.groups.meridian && 'p' === matches.groups.meridian.charAt(0).toLowerCase()) {
                hours += 12;
            }
        } else if (matches.groups.hours) {
            hours = ~~matches.groups.hours;
        }

        const minutes = ~~(matches.groups.minutes || 0);
        const seconds = ~~(matches.groups.seconds || 0);
        const milliseconds = ~~(matches.groups.milliseconds || 0);

        desc.day = day;
        desc.month = month;
        desc._year = year;
        desc.hour = hours;
        desc.minutes = minutes;
        desc.seconds = seconds;
        desc.milliseconds = milliseconds;

        return desc;
    }
}

module.exports = DateTimeFormatter;
