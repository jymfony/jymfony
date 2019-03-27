declare namespace Jymfony.Component.DateTime {
    /**
     * Represents a time interval.
     */
    export class TimeSpan {
        /**
         * Constructor.
         */
        constructor(duration?: string);

        public inverse: boolean;
        public milliseconds: number;
        public seconds: number;
        public minutes: number;
        public hours: number;
        public days: number;
        public months: number;
        public years: number;

        private _parse(isoDuration: string): void;
    }
}
