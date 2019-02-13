declare namespace Jymfony.Component.Logger.Handler {
    /**
     * Used for testing purposes.
     * It records all records and gives you access to them for verification.
     */
    export class TestHandler extends AbstractProcessingHandler {
        private _records: LogRecord[];
        private _recordsByLevel: Record<number, LogRecord[]>;

        /**
         * Constructor.
         */
        __construct(level?: number, bubble?: boolean): void;
        constructor(level?: number, bubble?: boolean);

        /**
         * Gets all the registered records.
         */
        public readonly records: LogRecord[];

        /**
         * Clears out all the recorded records.
         */
        clear(): void;

        /**
         * Checks whether we have at least one record for the given level.
         */
        hasRecords(level: number): boolean;

        /**
         * Whether a record with the same message has been recorded.
         *
         * @param {string|Object} record
         * @param {int} level
         *
         * @returns {boolean}
         */
        hasRecord(record: string | LogRecord, level: number): boolean;
        hasDebugRecord(record: string | LogRecord): boolean;
        hasInfoRecord(record: string | LogRecord): boolean;
        hasNoticeRecord(record: string | LogRecord): boolean;
        hasWarningRecord(record: string | LogRecord): boolean;
        hasErrorRecord(record: string | LogRecord): boolean;
        hasCriticalRecord(record: string | LogRecord): boolean;
        hasAlertRecord(record: string | LogRecord): boolean;
        hasEmergencyRecord(record: string | LogRecord): boolean;

        /**
         * Whether a record in which the given message is contained has been recorded.
         */
        hasRecordThatContains(message: string, level: number): boolean;
        hasDebugRecordThatContains(message: string): boolean;
        hasInfoRecordThatContains(message: string): boolean;
        hasNoticeRecordThatContains(message: string): boolean;
        hasWarningRecordThatContains(message: string): boolean;
        hasErrorRecordThatContains(message: string): boolean;
        hasCriticalRecordThatContains(message: string): boolean;
        hasAlertRecordThatContains(message: string): boolean;
        hasEmergencyRecordThatContains(message: string): boolean;

        /**
         * Whether a record with message that matches the given regex has been recorded.
         *
         * @param {RegExp} regex
         * @param {int} level
         *
         * @returns {boolean}
         */
        hasRecordThatMatches(regex: RegExp, level: number): boolean;
        hasDebugRecordThatMatches(regex: RegExp): boolean;
        hasInfoRecordThatMatches(regex: RegExp): boolean;
        hasNoticeRecordThatMatches(regex: RegExp): boolean;
        hasWarningRecordThatMatches(regex: RegExp): boolean;
        hasErrorRecordThatMatches(regex: RegExp): boolean;
        hasCriticalRecordThatMatches(regex: RegExp): boolean;
        hasAlertRecordThatMatches(regex: RegExp): boolean;
        hasEmergencyRecordThatMatches(regex: RegExp): boolean;

        /**
         * Checks whether a recorded record matches the given predicate.
         *
         * @throws {InvalidArgumentException}
         */
        hasRecordThatPasses(predicate: Invokable<boolean>, level: number): boolean;
        hasDebugRecordThatPasses(predicate: Invokable<boolean>): boolean;
        hasInfoRecordThatPasses(predicate: Invokable<boolean>): boolean;
        hasNoticeRecordThatPasses(predicate: Invokable<boolean>): boolean;
        hasWarningRecordThatPasses(predicate: Invokable<boolean>): boolean;
        hasErrorRecordThatPasses(predicate: Invokable<boolean>): boolean;
        hasCriticalRecordThatPasses(predicate: Invokable<boolean>): boolean;
        hasAlertRecordThatPasses(predicate: Invokable<boolean>): boolean;
        hasEmergencyRecordThatPasses(predicate: Invokable<boolean>): boolean;

        /**
         * @inheritdoc
         */
        protected _write(record: LogRecord): void;
    }
}
