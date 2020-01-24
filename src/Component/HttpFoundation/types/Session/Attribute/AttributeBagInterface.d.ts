declare namespace Jymfony.Component.HttpFoundation.Session.Attribute {
    /**
     * Attributes store.
     */
    export class AttributeBagInterface extends SessionBagInterface.definition {
        public static readonly definition: Newable<AttributeBagInterface>;

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
    }
}
