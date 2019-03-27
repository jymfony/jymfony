declare namespace Jymfony.Component.HttpFoundation.Session.Flash {
    /**
     * FlashBagInterface.
     */
    export class FlashBagInterface extends SessionBagInterface.definition {
        /**
         * Adds a flash message for type.
         */
        add(type: string, message: any): void;

        /**
         * Registers a message for a given type.
         */
        set(type: string, message: any | any[]): void;

        /**
         * Gets flash messages for a given type.
         *
         * @param type Message category type
         * @param [defaultValue = []] Default value if type does not exist
         */
        peek(type: string, defaultValue?: string[]): string[];

        /**
         * Gets all flash messages.
         */
        peekAll(): Record<string, string[]>;

        /**
         * Gets and clears flash from the stack.
         */
        get(type: string, defaultValue?: string[]): string[];

        /**
         * Gets and clears flashes from the stack.
         */
        all(): Record<string, string[]>;

        /**
         * Sets all flash messages.
         */
        setAll(messages: Record<string, any[]>): void;

        /**
         * Has flash messages for a given type?
         */
        has(type: string): boolean;

        /**
         * Returns a list of all defined types.
         */
        keys(): string[];
    }
}
