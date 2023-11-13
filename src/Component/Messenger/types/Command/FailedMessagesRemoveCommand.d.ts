declare namespace Jymfony.Component.Messenger.Command {
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import ReceiverInterface = Jymfony.Component.Messenger.Transport.Receiver.ReceiverInterface;

    export class FailedMessagesRemoveCommand extends AbstractFailedMessagesCommand {
        configure(): void;

        execute(input: InputInterface, output: OutputInterface): Promise<any>;

        private _removeMessages(
            failureTransportName: string,
            ids: string[],
            receiver: ReceiverInterface,
            io: JymfonyStyle,
            shouldForce: boolean,
            shouldDisplayMessages: boolean,
        ): Promise<void>;
    }
}
