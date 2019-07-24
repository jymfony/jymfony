declare namespace Jymfony.Bundle.FrameworkBundle.Command {
    import Command = Jymfony.Component.Console.Command.Command;
    import EncoderFactoryInterface = Jymfony.Component.Security.Encoder.EncoderFactoryInterface;
    import InputInterface = Jymfony.Component.Console.Input.InputInterface;
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
    import Question = Jymfony.Component.Console.Question.Question;
    import JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;

    /**
     * Encodes a user password.
     */
    export class UserPasswordEncoderCommand extends Command {
        /**
         * @inheritDoc
         */
        public static readonly defaultName: string;

        private _encoderFactory: EncoderFactoryInterface;
        private _userClasses: string[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(encoderFactory: EncoderFactoryInterface, userClasses: string[]): void;
        constructor(encoderFactory: EncoderFactoryInterface, userClasses: string[]);

        /**
         * @inheritdoc
         */
        configure(): void;

        /**
         * @inheritdoc
         */
        execute(input: InputInterface, output: OutputInterface): Promise<void>;

        /**
         * Create the password question to ask the user for the password to be encoded.
         */
        private _createPasswordQuestion(input: InputInterface, output: OutputInterface): Question;

        private static _generateSalt(): Promise<string>;

        private _getUserClass(input: InputInterface, io: JymfonyStyle): Promise<string>;
    }
}
