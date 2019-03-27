declare namespace Jymfony.Component.Console.Helper {
    import DescriptorInterface = Jymfony.Component.Console.Descriptor.DescriptorInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class DescriptorHelper extends Helper {
        private _descriptors: Record<string, DescriptorInterface>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Describes an object if supported.
         *
         * Available options are:
         * * format: string, the output format name
         * * raw_text: boolean, sets output type as raw
         *
         * @throws {Jymfony.Component.Console.Exception.InvalidArgumentException} when the given format is not supported
         */
        describe(output: OutputInterface, object: any, options?: { format: string, raw_text: boolean }): void;

        /**
         * Registers a descriptor.
         */
        register(format: string, descriptor: DescriptorInterface): this;
    }
}
