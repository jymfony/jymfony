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
         * Returns the Id of this alias.
         */
        toString(): string;
    }
}
