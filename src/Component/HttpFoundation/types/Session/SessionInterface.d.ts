declare namespace Jymfony.Component.HttpFoundation.Session {
    import FlashBagInterface = Jymfony.Component.HttpFoundation.Session.Flash.FlashBagInterface;

    /**
     * Interface for the session.
     */
    export class SessionInterface {
        public static readonly definition: Newable<SessionInterface>;

        /**
         * Starts the session storage.
         *
         * @throws {RuntimeException} if session fails to start
         */
        start(): Promise<void>;

        /**
         * The session ID.
         */
        public id: string;

        /**
         * The session name.
         */
        public name: string;

        /**
         * Invalidates the current session.
         *
         * Clears all session attributes and flashes and regenerates the
         * session and deletes the old session from persistence.
         *
         * @param [lifetime = 0] Sets the cookie lifetime for the session cookie. 0 sets the cookie
         *                       to expire with browser session. Time is in seconds, and is
         *                       not a Unix timestamp.
         */
        invalidate(lifetime?: number): Promise<void>;

        /**
         * Migrates the current session to a new session id while maintaining all
         * session attributes.
         *
         * @param [destroy = false] Whether to delete the old session or leave it to garbage collection
         * @param [lifetime = 0] Sets the cookie lifetime for the session cookie. 0 sets the cookie
         *                       to expire with browser session. Time is in seconds, and is
         *                       not a Unix timestamp.
         */
        migrate(destroy?: boolean, lifetime?: number): Promise<void>;

        /**
         * Force the session to be saved and closed.
         */
        save(): Promise<void>;

        /**
         * Checks if an attribute is defined.
         *
         * @param name The attribute name
         *
         * @returns true if the attribute is defined, false otherwise
         */
        has(name: string): boolean;

        /**
         * Returns an attribute.
         *
         * @param name The attribute name
         * @param [defaultValue] The default value if not found
         */
        get(name: string, defaultValue?: any): any;

        /**
         * Sets an attribute.
         */
        set(name: string, value: any): void;

        /**
         * Returns attributes.
         */
        all(): Record<string, any>;

        /**
         * Sets attributes.
         */
        replace(attributes: Record<string, any>): void;

        /**
         * Removes an attribute.
         *
         * @returns The removed value or null when it does not exist
         */
        remove(name: string): any;

        /**
         * Clears all attributes.
         */
        clear(): void;

        /**
         * Checks if the session was started.
         *
         * @returns {boolean}
         */
        public readonly started: boolean;

        /**
         * Registers a SessionBagInterface with the session.
         */
        registerBag(bag: SessionBagInterface): void;

        /**
         * Gets a bag instance by name.
         */
        getBag(name: string): SessionBagInterface;

        /**
         * Gets session meta.
         */
        public readonly attributesBag: AttributeBagInterface;

        /**
         * Gets session flashes.
         */
        public readonly flashBag: FlashBagInterface;
    }
}
