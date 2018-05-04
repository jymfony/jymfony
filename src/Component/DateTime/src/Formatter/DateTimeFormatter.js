const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
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
}

module.exports = DateTimeFormatter;
