declare namespace Jymfony.Contracts.Stopwatch {
    import RequestInterface = Jymfony.Contracts.HttpFoundation.RequestInterface;
    import CommandInterface = Jymfony.Contracts.Console.CommandInterface;

    /**
     * Stopwatch provides a way to profile code.
     */
    export class StopwatchInterface {
        public static readonly definition: Newable<StopwatchInterface>;

        /**
         * Gets the sections for the given subject.
         */
        getSections(subject?: string | RequestInterface | CommandInterface): SectionInterface[];

        /**
         * Creates a new section or re-opens an existing section.
         *
         * @param id The id of the session to re-open, null to create a new one
         *
         * @throws {LogicException} When the section to re-open is not reachable
         */
        openSection(id?: string | null): void;

        /**
         * Stops the last started section.
         * The id parameter is used to retrieve the events from this section.
         *
         * @see getSectionEvents()
         *
         * @param id The identifier of the section
         *
         * @throws {LogicException} When there's no started section to be stopped
         */
        stopSection(id: string): void;

        /**
         * Starts an event.
         */
        start(name: string, category?: string | null): StopwatchEventInterface;

        /**
         * Checks if the event was started.
         */
        isStarted(name: string): boolean;

        /**
         * Stops an event.
         */
        stop(name: string): StopwatchEventInterface;

        /**
         * Stops then restarts an event.
         */
        lap(name: string): StopwatchEventInterface;

        /**
         * Returns a specific event by name.
         */
        getEvent(name: string): StopwatchEventInterface;

        /**
         * Gets all events for a given section.
         */
        getSectionEvents(id: string): Record<string, StopwatchEventInterface>;
    }
}
