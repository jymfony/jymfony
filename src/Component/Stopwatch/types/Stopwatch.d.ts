declare namespace Jymfony.Component.Stopwatch {
    import ClsTrait = Jymfony.Contracts.Async.ClsTrait;
    import Command = Jymfony.Component.Console.Command.Command;
    import EventSubscriberInterface = Jymfony.Contracts.EventDispatcher.EventSubscriberInterface;
    import EventSubscriptions = Jymfony.Contracts.EventDispatcher.EventSubscriptions;
    import Request = Jymfony.Component.HttpFoundation.Request;
    import StopwatchInterface = Jymfony.Contracts.Stopwatch.StopwatchInterface;

    /**
     * Stopwatch provides a way to profile code.
     */
    export class Stopwatch extends implementationOf(StopwatchInterface, EventSubscriberInterface, ClsTrait) {
        private _sections: Map<string | Request | Command, Section[]>;
        private _activeSections: Map<string | Request | Command, Section[]>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Gets the sections for the given subject.
         */
        getSections(subject?: string | Request | Command): Section[];

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
        start(name: string, category?: string | null): StopwatchEvent;

        /**
         * Checks if the event was started.
         */
        isStarted(name: string): boolean;

        /**
         * Stops an event.
         */
        stop(name: string): StopwatchEvent;

        /**
         * Stops then restarts an event.
         */
        lap(name: string): StopwatchEvent;

        /**
         * Returns a specific event by name.
         */
        getEvent(name: string): StopwatchEvent;

        /**
         * Gets all events for a given section.
         */
        getSectionEvents(id: string): Record<string, StopwatchEvent>;

        /**
         * Gets the correct active sections array.
         */
        private _getActiveSections(): Section[];

        /**
         * Gets the correct sections array.
         */
        private _getSections(): Section[];

        /**
         * @inheritdoc
         */
        static getSubscribedEvents(): EventSubscriptions;
    }
}
