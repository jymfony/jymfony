declare namespace Jymfony.Contracts.DateTime {
    /**
     * Represents a time interval.
     */
    export class TimeSpanInterface {
        public static readonly definition: Newable<TimeSpanInterface>;

        public inverse: boolean;
        public milliseconds: number;
        public seconds: number;
        public minutes: number;
        public hours: number
        public days: number;
        public months: number
        public years: number;
    }
}
