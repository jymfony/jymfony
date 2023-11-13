declare namespace Jymfony.Component.Messenger.Command {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class FailedMessagesShowCommand extends AbstractFailedMessagesCommand {
        /**
         * {@inheritdoc}
         */
        configure(): void;

        /**
         * {@inheritdoc}
         */
        execute(input: InputInterface, output: OutputInterface): Promise<number>;

        private _listMessages(failedTransportName: string | null, io: JymfonyStyle, max: number | null): Promise<void>;
        private _showMessage(failedTransportName: string | null, id: string, io: JymfonyStyle): Promise<void>;
    }
}
