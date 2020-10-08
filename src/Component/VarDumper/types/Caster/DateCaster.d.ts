declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;
    import DateTimeInterface = Jymfony.Contracts.DateTime.DateTimeInterface;
    import DateTimeZoneInterface = Jymfony.Contracts.DateTime.DateTimeZoneInterface;

    export class DateCaster {
        /**
         * Casts a Date object.
         */
        static castDate(date: Date, a: any, stub: Stub): any;

        /**
         * Casts a Jymfony datetime object.
         */
        static castDateTime(dateTime: DateTimeInterface, a: any, stub: Stub): any;

        /**
         * Casts a Jymfony timezone object.
         */
        static castDateTimeZone(timezone: DateTimeZoneInterface): any;
    }
}
