declare namespace Jymfony.Component.Console.Descriptor {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class DescriptorInterface {
        public static readonly definition: Newable<DescriptorInterface>;

        /**
         * Describes an InputArgument instance.
         */
        describe(output: OutputInterface, object: any, options?: any): void;
    }
}
