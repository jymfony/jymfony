const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class QuoteTest extends TestCase {
    get testCaseName() {
        return 'Regex quote';
    }

    testBasicFunctionality() {
        __self.assertEquals('/this \\*\\-has \\\\ metacharacters\\^ in \\$', __jymfony.regex_quote('/this *-has \\ metacharacters^ in $'));
    }

    testNativeRegexInstanceOfNamedRegexShouldReturnTrue() {
        if (! __jymfony.Platform.hasModernRegex()) {
            __self.markTestSkipped();
        }

        __self.assertInstanceOf(RegExp, /23/gi);
    }
}
