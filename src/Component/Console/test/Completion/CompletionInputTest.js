const CompletionInput = Jymfony.Component.Console.Completion.CompletionInput;
const InputArgument = Jymfony.Component.Console.Input.InputArgument;
const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class CompletionInputTest extends TestCase {
    get testCaseName() {
        return '[Console] ' + super.testCaseName;
    }

    /**
     * @param {Jymfony.Component.Console.Completion.CompletionInput} input
     * @param {string} expectedType
     * @param {string | null} expectedName
     * @param {string} expectedValue
     */
    @dataProvider('provideBindData')
    testBind(input, expectedType, expectedName, expectedValue) {
        const definition = new InputDefinition([
            new InputOption('with-required-value', 'r', InputOption.VALUE_REQUIRED),
            new InputOption('with-optional-value', 'o', InputOption.VALUE_OPTIONAL),
            new InputOption('without-value', 'n', InputOption.VALUE_NONE),
            new InputArgument('required-arg', InputArgument.REQUIRED),
            new InputArgument('optional-arg', InputArgument.OPTIONAL),
        ]);

        input.bind(definition);

        __self.assertEquals(expectedType, input.completionType, 'Unexpected type');
        __self.assertEquals(expectedName, input.completionName, 'Unexpected name');
        __self.assertEquals(expectedValue, input.completionValue, 'Unexpected value');
    }

    * provideBindData() {
        // Option names
        yield [ CompletionInput.fromTokens([ 'bin/console', '-' ], 1), CompletionInput.TYPE_OPTION_NAME, null, '-' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '--with' ], 1), CompletionInput.TYPE_OPTION_NAME, null, '--with' ];

        // Option values
        yield [ CompletionInput.fromTokens([ 'bin/console', '-r' ], 1), CompletionInput.TYPE_OPTION_VALUE, 'with-required-value', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '-rsymf' ], 1), CompletionInput.TYPE_OPTION_VALUE, 'with-required-value', 'symf' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '-r' ], 2), CompletionInput.TYPE_OPTION_VALUE, 'with-required-value', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '-r', 'symf' ], 2), CompletionInput.TYPE_OPTION_VALUE, 'with-required-value', 'symf' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '-r', 'symfony' ], 1), CompletionInput.TYPE_OPTION_VALUE, 'with-required-value', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '--with-required-value=' ], 1), CompletionInput.TYPE_OPTION_VALUE, 'with-required-value', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '--with-required-value=symf' ], 1), CompletionInput.TYPE_OPTION_VALUE, 'with-required-value', 'symf' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '--with-required-value' ], 2), CompletionInput.TYPE_OPTION_VALUE, 'with-required-value', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '--with-required-value', 'symf' ], 2), CompletionInput.TYPE_OPTION_VALUE, 'with-required-value', 'symf' ];

        yield [ CompletionInput.fromTokens([ 'bin/console', '-o' ], 1), CompletionInput.TYPE_OPTION_VALUE, 'with-optional-value', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '-o' ], 2), CompletionInput.TYPE_OPTION_VALUE, 'with-optional-value', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '--with-optional-value=' ], 1), CompletionInput.TYPE_OPTION_VALUE, 'with-optional-value', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '--with-optional-value' ], 2), CompletionInput.TYPE_OPTION_VALUE, 'with-optional-value', '' ];

        // Arguments
        yield [ CompletionInput.fromTokens([ 'bin/console' ], 1), CompletionInput.TYPE_ARGUMENT_VALUE, 'required-arg', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', 'symfony' ], 2), CompletionInput.TYPE_ARGUMENT_VALUE, 'optional-arg', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', 'symf' ], 1), CompletionInput.TYPE_ARGUMENT_VALUE, 'required-arg', 'symf' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', 'symfony', 'sen' ], 2), CompletionInput.TYPE_ARGUMENT_VALUE, 'optional-arg', 'sen' ];

        yield [ CompletionInput.fromTokens([ 'bin/console', '--without-value' ], 2), CompletionInput.TYPE_ARGUMENT_VALUE, 'required-arg', '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', '--with-optional-value', '--' ], 3), CompletionInput.TYPE_ARGUMENT_VALUE, 'required-arg', '' ];

        // End of definition
        yield [ CompletionInput.fromTokens([ 'bin/console', 'symfony', 'sensiolabs' ], 3), CompletionInput.TYPE_NONE, null, '' ];
    }

    /**
     * @param {Jymfony.Component.Console.Completion.CompletionInput} input
     * @param {string | null} expectedValue
     */
    @dataProvider('provideBindWithLastArrayArgumentData')
    testBindWithLastArrayArgument(input, expectedValue) {
        const definition = new InputDefinition([
            new InputArgument('list-arg', InputArgument.IS_ARRAY | InputArgument.REQUIRED),
        ]);

        input.bind(definition);

        __self.assertEquals(CompletionInput.TYPE_ARGUMENT_VALUE, input.completionType, 'Unexpected type');
        __self.assertEquals('list-arg', input.completionName, 'Unexpected name');
        __self.assertEquals(expectedValue, input.completionValue, 'Unexpected value');
    }

    * provideBindWithLastArrayArgumentData() {
        yield [ CompletionInput.fromTokens([ 'bin/console' ], 1), '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', 'symfony', 'sensiolabs' ], 3), '' ];
        yield [ CompletionInput.fromTokens([ 'bin/console', 'symfony', 'sen' ], 2), 'sen' ];
    }

    testBindArgumentWithDefault() {
        const definition = new InputDefinition([
            new InputArgument('arg-with-default', InputArgument.OPTIONAL, '', 'default'),
        ]);

        const input = CompletionInput.fromTokens([ 'bin/console' ], 1);
        input.bind(definition);

        __self.assertEquals(CompletionInput.TYPE_ARGUMENT_VALUE, input.completionType, 'Unexpected type');
        __self.assertEquals('arg-with-default', input.completionName, 'Unexpected name');
        __self.assertEquals('', input.completionValue, 'Unexpected value');
    }

    @dataProvider('provideFromStringData')
    testFromString(inputStr, expectedTokens) {
        const input = CompletionInput.fromString(inputStr, 1);
        __self.assertEquals(expectedTokens, input._tokens);
    }

    * provideFromStringData() {
        yield [ 'bin/console cache:clear', [ 'bin/console', 'cache:clear' ] ];
        yield [ 'bin/console --env prod', [ 'bin/console', '--env', 'prod' ] ];
        yield [ 'bin/console --env=prod', [ 'bin/console', '--env=prod' ] ];
        yield [ 'bin/console -eprod', [ 'bin/console', '-eprod' ] ];
        yield [ 'bin/console cache:clear "multi word string"', [ 'bin/console', 'cache:clear', '"multi word string"' ] ];
        yield [ 'bin/console cache:clear \'multi word string\'', [ 'bin/console', 'cache:clear', '\'multi word string\'' ] ];
    }
}
