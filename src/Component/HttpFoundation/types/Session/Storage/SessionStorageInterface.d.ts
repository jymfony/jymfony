declare namespace Jymfony.Component.HttpFoundation.Session.Storage {
    import SessionBagInterface = Jymfony.Component.HttpFoundation.Session.SessionBagInterface;

    export class SessionStorageInterface {
        /**
         * Starts the session.
         *
         * @throws {RuntimeException} if something goes wrong starting the session
         */
        start(): Promise<void>;

        /**
         * Checks if the session is started.
         *
         * @returns True if started, false otherwise
         */
        public readonly started: boolean;

        /**
         * The session ID.
         */
        public id: string | undefined;

        /**
         * The session name.
         */
        public name: string;

        /**
         * Regenerates id that represents this storage.
         *
         * Note regenerate+destroy should not clear the session data in memory
         * only delete the session data from persistent storage.
         *
         * @param [destroy = false] Destroy session when regenerating?
         * @param [lifetime = 0] Sets the cookie lifetime for the session cookie. 0 sets the cookie
         *                       to expire with browser session. Time is in seconds, and is
         *                       not a Unix timestamp.
         *
         * @throws {RuntimeException} If an error occurs while regenerating this storage
         */
        regenerate(destroy?: boolean, lifetime?: number): Promise<void>;

        /**
         * Force the session to be saved and closed.
         *
         * @throws {RuntimeException} if the session is saved without being started, or if the session
         *                            is already closed
         */
        save(): Promise<void>;

        /**
         * Clear all session data in memory.
         */
        clear(): Promise<void>;

        /**
         * Gets a SessionBagInterface by name.
         *
         * @throws {InvalidArgumentException} If the bag does not exist
         */
        getBag(name: string): SessionBagInterface;

        /**
         * Registers a SessionBagInterface for use.
         */
        registerBag(bag: SessionBagInterface): void;
    }
}
