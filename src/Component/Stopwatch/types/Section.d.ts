declare namespace Jymfony.Component.Stopwatch {
    /**
     * Stopwatch section.
     */
    export class Section {
        private _events: Record<string, StopwatchEvent>;
        private _origin: number | null;
        private _id?: string;
        private _children: Section[];

        /**
         * Constructor.
         *
         * @param origin Set the origin of the events in this section, use null to set their origin to their start time
         */
        __construct(origin?: number | null): void;
        constructor(origin?: number | null);

        /**
         * Returns the child section.
         *
         * @param id The child section identifier
         *
         * @returns The child section or null when none found
         */
        get(id: string): Section | undefined;

        /**
         * Creates or re-opens a child section.
         *
         * @param id Null to create a new section, the identifier to re-open an existing one
         */
        open(id: string | null): Section;

        /**
         * Gets the identifier of the section
         *
         * @returns {string} The identifier of the section
         */
        public readonly id: string;

        /**
         * Sets the section identifier.
         */
        setId(id: string): this;

        /**
         * Starts an event.
         */
        startEvent(name: string, category: string): StopwatchEvent;

        /**
         * Checks if the event was started.
         */
        isEventStarted(name: string): boolean;

        /**
         * Stops an event.
         *
         * @throws {LogicException} When the event has not been started
         */
        stopEvent(name: string): StopwatchEvent;

        /**
         * Stops then restarts an event.
         *
         * @throws {LogicException} When the event has not been started
         */
        lap(name: string): StopwatchEvent;

        /**
         * Returns a specific event by name.
         *
         * @throws {LogicException} When the event is not known
         */
        getEvent(name: string): StopwatchEvent;

        /**
         * Returns the events from this section.
         */
        getEvents(): Record<string, StopwatchEvent>;
    }
}
