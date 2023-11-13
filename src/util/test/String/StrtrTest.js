const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class StrtrTest extends TestCase {
    testShouldWorkCorrectlyWithObjects() {
        const trans = {'hello': 'hi', 'hi': 'hello', 'a': 'A', 'world': 'planet'};
        __self.assertEquals('# hello All, I sAid hi planet! #', __jymfony.strtr('# hi all, I said hello world! #', trans));
    }

    testShouldWorkCorrectlyWithRegexSpecialChars() {
        const trans = {'hello': 'hi', '\\hi?': 'hello#', '(a': ')A', 'world': 'planet'};
        __self.assertEquals('# hello# )All), I said hi planet! #', __jymfony.strtr('# \\hi? (all), I said hello world! #', trans));
    }

    testShouldWorkCorrectlyWithNoReplacePairs() {
        const trans = {};
        __self.assertEquals('# \\hi? (all), I said hello world! #', __jymfony.strtr('# \\hi? (all), I said hello world! #', trans));
    }

    testShouldWorkCorrectlyWithFromToStrings() {
        __self.assertEquals('AbCDefg', __jymfony.strtr('abcdefg', 'acd', 'ACD'));
    }
}
