const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const ConstStub = Jymfony.Component.VarDumper.Caster.ConstStub;

/**
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
class DateCaster {
    /**
     * Casts a Date object.
     *
     * @param {Date} date
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     *
     * @returns {Object}
     */
    static castDate(date, a, stub) {
        stub.class_ += ' @' + ~~(date.getTime() / 1000);

        return {
            [Caster.PREFIX_VIRTUAL + 'date']: new ConstStub(date.toISOString()),
        };
    }

    /**
     * Casts a Jymfony datetime object.
     *
     * @param {Jymfony.Component.DateTime.DateTime} dateTime
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     *
     * @returns {Object}
     */
    static castDateTime(dateTime, a, stub) {
        stub.class_ += ' @' + dateTime.timestamp;

        const location = dateTime.timezone.name;
        const title = dateTime.format('l, F j, Y') +
            (location ? (dateTime.timezone.isDST(dateTime) ? '\nDST On' : '\nDST Off') : '')
        ;

        return {
            [Caster.PREFIX_VIRTUAL + 'date']: new ConstStub(title, dateTime.toString() + '.' + dateTime.millisecond),
        };
    }

    /**
     * Casts a Jymfony timezone object.
     *
     * @param {Jymfony.Component.DateTime.DateTimeZone} timezone
     *
     * @returns {Object}
     */
    static castDateTimeZone(timezone) {
        const location = timezone.name;

        return { [Caster.PREFIX_VIRTUAL + 'timezone']: new ConstStub(location) };
    }
}

module.exports = DateCaster;
