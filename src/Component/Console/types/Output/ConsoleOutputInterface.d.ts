declare namespace Jymfony.Component.Console.Output {
    export class ConsoleOutputInterface extends OutputInterface.definition {
        public static readonly definition: Newable<ConsoleOutputInterface>;

        /**
         * Output interface used for errors.
         */
        public errorOutput: Jymfony.Component.Console.Output.OutputInterface;
    }
}
