declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;
    import DateTime = Jymfony.Component.DateTime.DateTime;
    import DateTimeZone = Jymfony.Component.DateTime.DateTimeZone;

    export class DateCaster {
        /**
         * Casts a Date object.
         */
        static castDate(date: Date, a: any, stub: Stub): any;

        /**
         * Casts a Jymfony datetime object.
         */
        static castDateTime(dateTime: DateTime, a: any, stub: Stub): any;

        /**
         * Casts a Jymfony timezone object.
         */
        static castDateTimeZone(timezone: DateTimeZone): any;
    }
}
