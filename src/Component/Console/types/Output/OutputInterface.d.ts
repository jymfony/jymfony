declare namespace Jymfony.Component.Console.Output {
    import OutputFormatterInterface = Jymfony.Component.Console.Formatter.OutputFormatterInterface;
    import ContractsOutputInterface = Jymfony.Contracts.Console.OutputInterface;

    export class OutputInterface extends ContractsOutputInterface {
        public static readonly definition: Newable<OutputInterface>;

        /**
         * Gets/sets output formatter.
         */
        public formatter: OutputFormatterInterface;
    }
}
