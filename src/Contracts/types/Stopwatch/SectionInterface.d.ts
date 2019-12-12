declare namespace Jymfony.Contracts.Stopwatch {
    /**
     * Stopwatch section.
     */
    export class SectionInterface extends MixinInterface {
        public static readonly definition: Newable<SectionInterface>;

        /**
         * Returns the child section.
         *
         * @param id The child section identifier
         *
         * @returns The child section or null when none found
         */
        get(id: string): SectionInterface | undefined;

        /**
         * Creates or re-opens a child section.
         *
         * @param id Null to create a new section, the identifier to re-open an existing one
         */
        open(id: string | null): SectionInterface;

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
        startEvent(name: string, category: string): StopwatchEventInterface;

        /**
         * Checks if the event was started.
         */
        isEventStarted(name: string): boolean;

        /**
         * Stops an event.
         *
         * @throws {LogicException} When the event has not been started
         */
        stopEvent(name: string): StopwatchEventInterface;

        /**
         * Stops then restarts an event.
         *
         * @throws {LogicException} When the event has not been started
         */
        lap(name: string): StopwatchEventInterface;

        /**
         * Returns a specific event by name.
         *
         * @throws {LogicException} When the event is not known
         */
        getEvent(name: string): StopwatchEventInterface;

        /**
         * Returns the events from this section.
         */
        getEvents(): Record<string, StopwatchEventInterface>;
    }
}
