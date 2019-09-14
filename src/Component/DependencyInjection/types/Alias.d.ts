declare namespace Jymfony.Component.DependencyInjection {
    export class Alias {
        /**
         * Constructor.
         */
        __construct(id: string, public_?: boolean): void;
        constructor(id: string, public_?: boolean);

        /**
         * Checks if should be public.
         */
        isPublic(): boolean;

        /**
         * Sets if this Alias is public.
         */
        setPublic(public_: boolean): this;

        /**
         * Whether this alias is deprecated, that means it should not be referenced
         * anymore.
         *
         * @param status Whether this alias is deprecated, defaults to true
         * @param template Optional template message to use if the alias is deprecated
         *
         * @throws {InvalidArgumentException} when the message template is invalid
         */
        setDeprecated(status?: boolean, template?: string): this;

        /**
         * Checks whether this service is deprecated.
         */
        isDeprecated(): boolean;

        /**
         * Build the deprecation message for a given alias id.
         */
        getDeprecationMessage(id: string): string;

        /**
         * Returns the Id of this alias.
         */
        toString(): string;
    }
}
