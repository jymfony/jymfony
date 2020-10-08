const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const ConstStub = Jymfony.Component.VarDumper.Caster.ConstStub;

/**
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
export default class DateCaster {
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
     * @param {Jymfony.Contracts.DateTime.DateTimeInterface} dateTime
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
            [Caster.PREFIX_VIRTUAL + 'date']: new ConstStub(dateTime.format('Y-m-d\\TH:i:s.vP'), title),
        };
    }

    /**
     * Casts a Jymfony timezone object.
     *
     * @param {Jymfony.Contracts.DateTime.DateTimeZoneInterface} timezone
     *
     * @returns {Object}
     */
    static castDateTimeZone(timezone) {
        const location = timezone.name;

        return { [Caster.PREFIX_VIRTUAL + 'timezone']: new ConstStub(location) };
    }
}
