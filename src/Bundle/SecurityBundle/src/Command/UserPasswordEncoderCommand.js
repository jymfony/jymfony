const Command = Jymfony.Component.Console.Command.Command;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const QuestionBuilder = Jymfony.Component.Console.Question.Builder.QuestionBuilder;
const QuestionType = Jymfony.Component.Console.Question.QuestionType;
const JymfonyStyle = Jymfony.Component.Console.Style.JymfonyStyle;
const SelfSaltingEncoderInterface = Jymfony.Component.Security.Encoder.SelfSaltingEncoderInterface;

const crypto = require('crypto');
const os = require('os');
const promisify = require('util').promisify;
const randomBytes = promisify(crypto.randomBytes);

/**
 * Encodes a user password.
 *
 * @memberOf Jymfony.Bundle.SecurityBundle.Command
 */
class UserPasswordEncoderCommand extends Command {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Security.Encoder.EncoderFactoryInterface} encoderFactory
     * @param {string[]} userClasses
     */
    __construct(encoderFactory, userClasses) {
        /**
         * @type {Jymfony.Component.Security.Encoder.EncoderFactoryInterface}
         *
         * @private
         */
        this._encoderFactory = encoderFactory;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._userClasses = userClasses;

        super.__construct();
    }

    /**
     * @inheritdoc
     */
    configure() {
        this
            .addArgument('password', InputArgument.OPTIONAL, 'The plain password to encode.')
            .addArgument('user-class', InputArgument.OPTIONAL, 'The User entity class path associated with the encoder used to encode the password.')
            .addOption('empty-salt', undefined, InputOption.VALUE_NONE, 'Do not generate a salt or let the encoder generate one.')
        ;

        this.name = 'security:encode-password';
        this.description = 'Encodes a password.';
        this.help = `
The <info>%command.name%</info> command encodes passwords according to your
security configuration. This command is mainly used to generate passwords for
the <comment>in_memory</comment> user provider type and for changing passwords
in the database while developing the application.

Suppose that you have the following security configuration in your application:

<comment>
# app/config/security.yml
security:
    encoders:
        Jymfony.Component.Security.User.User: plaintext
        App.Entity.User: sha512
</comment>

If you execute the command non-interactively, the first available configured
user class under the <comment>security.encoders</comment> key is used and a random salt is
generated to encode the password:

  <info>%command.full_name% --no-interaction [password]</info>

Pass the full user class path as the second argument to encode passwords for
your own entities:

  <info>%command.full_name% --no-interaction [password] App.Entity.User</info>

Executing the command interactively allows you to generate a random salt for
encoding the password:

  <info>%command.full_name% [password] App.Entity.User</info>

In case your encoder doesn't require a salt, add the <comment>empty-salt</comment> option:

  <info>%command.full_name% --empty-salt [password] App.Entity.User</info>

`;
    }

    /**
     * @inheritdoc
     */
    async execute(input, output) {
        const io = new JymfonyStyle(input, output);
        const errorIo = io.getErrorStyle();

        if (input.interactive) {
            errorIo.title('Jymfony Password Encoder Utility');
        } else {
            errorIo.newLine();
        }

        let password = input.getArgument('password');
        const userClass = await this._getUserClass(input, io);
        let emptySalt = input.getOption('empty-salt');

        const encoder = this._encoderFactory.getEncoder(userClass);
        const saltlessWithoutEmptySalt = ! emptySalt && encoder instanceof SelfSaltingEncoderInterface;

        if (saltlessWithoutEmptySalt) {
            emptySalt = true;
        }

        if (! password) {
            if (! input.interactive) {
                errorIo.error('The password must not be empty.');

                return 1;
            }

            password = await this._createPasswordQuestion(input, errorIo).ask();
        }

        let salt = null;

        if (input.interactive && ! emptySalt) {
            emptySalt = true;

            errorIo.note('The command will take care of generating a salt for you. Be aware that some encoders advise to let them generate their own salt. If you\'re using one of those encoders, please answer \'no\' to the question below. ' +
                os.EOL + 'Provide the \'empty-salt\' option in order to let the encoder handle the generation itself.');

            if (errorIo.confirm('Confirm salt generation?')) {
                salt = await __self._generateSalt();
                emptySalt = false;
            }
        } else if (! emptySalt) {
            salt = await __self._generateSalt();
        }

        const encodedPassword = encoder.encodePassword(password, salt);

        const rows = [
            [ 'Encoder used', ReflectionClass.getClassName(encoder) ],
            [ 'Encoded password', encodedPassword ],
        ];

        if (! emptySalt) {
            rows.push([ 'Generated salt', salt ]);
        }

        io.table([ 'Key', 'Value' ], rows);

        if (! emptySalt) {
            errorIo.note(__jymfony.sprintf('Make sure that your salt storage field fits the salt length: %s chars', salt.length));
        } else if (saltlessWithoutEmptySalt) {
            errorIo.note('Self-salting encoder used: the encoder generated its own built-in salt.');
        }

        errorIo.success('Password encoding succeeded');
    }

    /**
     * Create the password question to ask the user for the password to be encoded.
     *
     * @returns {Jymfony.Component.Console.Question.Question}
     */
    _createPasswordQuestion(input, output) {
        return QuestionBuilder.create(input, output)
            .setPrompt('Type in your password to be encoded')
            .setValidator(value => {
                if ('' === __jymfony.trim(value)) {
                    throw new InvalidArgumentException('The password must not be empty.');
                }
            })
            .setType(QuestionType.PASSWORD)
            .build()
        ;
    }

    /**
     * @returns {Promise<string>}
     *
     * @private
     */
    static async _generateSalt() {
        return (await randomBytes(30)).toString('hex');
    }

    /**
     * @param {Jymfony.Component.Console.Input.InputInterface} input
     * @param {Jymfony.Component.Console.Style.JymfonyStyle} io
     *
     * @returns {Promise<string>}
     *
     * @private
     */
    async _getUserClass(input, io) {
        const userClass = input.getArgument('user-class');
        if (! userClass) {
            return userClass;
        }

        if (0 === this._userClasses.length) {
            throw new RuntimeException('There are no configured encoders for the "security" extension.');
        }

        if (! input.interactive || 1 === this._userClasses.length) {
            return this._userClasses[0];
        }

        const userClasses = this._userClasses.sort();

        return await io.choice('For which user class would you like to encode a password?', userClasses, userClasses[0]);
    }
}

module.exports = UserPasswordEncoderCommand;
