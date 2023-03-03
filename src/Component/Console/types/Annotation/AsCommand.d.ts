declare namespace Jymfony.Component.Console.Annotation {
    /**
     * Service tag to autoconfigure commands.
     */
    export class AsCommand {
        private _name: string;
        private _description: string | null;

        /**
         * Constructor.
         */
        __construct(options: { name: string, description?: string, aliases?: string[], hidden?: boolean }): void;
        constructor(options: { name: string, description?: string, aliases?: string[], hidden?: boolean });

        public readonly name: string;

        /**
         * @return {string}
         */
        public readonly description: string | null;
    }
}
