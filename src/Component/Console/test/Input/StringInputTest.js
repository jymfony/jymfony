const InputDefinition = Jymfony.Component.Console.Input.InputDefinition;
const InputOption = Jymfony.Component.Console.Input.InputOption;
const StringInput = Jymfony.Component.Console.Input.StringInput;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class StringInputTest extends TestCase {
    @dataProvider('getTokenizeData')
    testTokenize(input, tokens, message) {
        input = new StringInput(input);
        __self.assertEquals(tokens, input._tokens, message);
    }

    testInputOptionWithGivenString() {
        const definition = new InputDefinition(
            [ new InputOption('foo', null, InputOption.VALUE_REQUIRED) ]
        );

        // Call to bind
        const input = new StringInput('--foo=bar');
        input.bind(definition);
        __self.assertEquals('bar', input.getOption('foo'));
    }

    getTokenizeData() {
        return [
            [ '', [], '.tokenize() parses an empty string' ],
            [ 'foo', [ 'foo' ], '.tokenize() parses arguments' ],
            [ '  foo  bar  ', [ 'foo', 'bar' ], '.tokenize() ignores whitespaces between arguments' ],
            [ '"quoted"', [ 'quoted' ], '.tokenize() parses quoted arguments' ],
            [ '\'quoted\'', [ 'quoted' ], '.tokenize() parses quoted arguments' ],
            [ '\'a\rb\nc\td\'', [ 'a\rb\nc\td' ], '.tokenize() parses whitespace chars in strings' ],
            [ '\'a\'\r\'b\'\n\'c\'\t\'d\'', [ 'a', 'b', 'c', 'd' ], '.tokenize() parses whitespace chars between args as spaces' ],
            [ '\\"quoted\\"', [ '"quoted"' ], '.tokenize() parses escaped-quoted arguments' ],
            [ '\\\'quoted\\\'', [ '\'quoted\'' ], '.tokenize() parses escaped-quoted arguments' ],
            [ '-a', [ '-a' ], '.tokenize() parses short options' ],
            [ '-azc', [ '-azc' ], '.tokenize() parses aggregated short options' ],
            [ '-awithavalue', [ '-awithavalue' ], '.tokenize() parses short options with a value' ],
            [ '-a"foo bar"', [ '-afoo bar' ], '.tokenize() parses short options with a value' ],
            [ '-a"foo bar""foo bar"', [ '-afoo barfoo bar' ], '.tokenize() parses short options with a value' ],
            [ '-a\'foo bar\'', [ '-afoo bar' ], '.tokenize() parses short options with a value' ],
            [ '-a\'foo bar\'\'foo bar\'', [ '-afoo barfoo bar' ], '.tokenize() parses short options with a value' ],
            [ '-a\'foo bar\'"foo bar"', [ '-afoo barfoo bar' ], '.tokenize() parses short options with a value' ],
            [ '--long-option', [ '--long-option' ], '.tokenize() parses long options' ],
            [ '--long-option=foo', [ '--long-option=foo' ], '.tokenize() parses long options with a value' ],
            [ '--long-option="foo bar"', [ '--long-option=foo bar' ], '.tokenize() parses long options with a value' ],
            [ '--long-option="foo bar""another"', [ '--long-option=foo baranother' ], '.tokenize() parses long options with a value' ],
            [ '--long-option=\'foo bar\'', [ '--long-option=foo bar' ], '.tokenize() parses long options with a value' ],
            [ '--long-option=\'foo bar\'\'another\'', [ '--long-option=foo baranother' ], '.tokenize() parses long options with a value' ],
            [ '--long-option=\'foo bar\'"another"', [ '--long-option=foo baranother' ], '.tokenize() parses long options with a value' ],
            [ 'foo -a -ffoo --long bar', [ 'foo', '-a', '-ffoo', '--long', 'bar' ], '.tokenize() parses when several arguments and options' ],
            [ '--arg=\\"\'Jenny\'\\\'\'s\'\\"', [ '--arg="Jenny\'s"' ], '.tokenize() parses quoted quotes' ],
        ];
    }

    testToString() {
        let input = new StringInput('-f foo');
        __self.assertEquals('-f foo', input.toString());

        input = new StringInput('-f --bar=foo "a b c d"');
        __self.assertEquals('-f --bar=foo ' + __jymfony.escapeshellarg('a b c d'), input.toString());

        input = new StringInput('-f --bar=foo \'a b c d\' \'A\nB\\\'C\'');
        __self.assertEquals('-f --bar=foo ' + __jymfony.escapeshellarg('a b c d') + ' ' + __jymfony.escapeshellarg('A\nB\'C'), input.toString());
    }
}
