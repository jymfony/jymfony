declare namespace Jymfony.Component.Console.Descriptor {
    import Command = Jymfony.Component.Console.Command.Command;

    export class ApplicationDescription {
        public static readonly GLOBAL_NAMESPACE = '_global';

        private _application: Application;
        private _namespace?: string;

        private _aliases?: Record<string, Command>;
        private _commands?: Record<string, Command>;
        private _namespaces?: Record<string, { id: string, commands: string[] }>;

        /**
         * Constructor.
         */
        __construct(application: Application, namespace?: string|undefined): void;
        constructor(application: Application, namespace?: string|undefined);

        public readonly namespaces: { id: string, commands: string[] };

        public readonly commands: Record<string, Command>;

        /**
         * @throws {Jymfony.Component.Console.Exception.CommandNotFoundException}
         */
        getCommand(name: string): Command;

        private _inspectApplication(): void;

        _sortCommands(commands: Record<string, Command>): IterableIterator<[string, [string, Command][]]>;
    }
}
