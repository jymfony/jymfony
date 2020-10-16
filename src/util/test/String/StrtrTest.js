import '../../lib/String/strtr';
import { expect } from 'chai';

const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class StrtrTest extends TestCase {
    testShouldWorkCorrectlyWithObjects() {
        const trans = {'hello': 'hi', 'hi': 'hello', 'a': 'A', 'world': 'planet'};
        expect(__jymfony.strtr('# hi all, I said hello world! #', trans))
            .to.be.equal('# hello All, I sAid hi planet! #');
    }

    testShouldWorkCorrectlyWithRegexSpecialChars() {
        const trans = {'hello': 'hi', '\\hi?': 'hello#', '(a': ')A', 'world': 'planet'};
        expect(__jymfony.strtr('# \\hi? (all), I said hello world! #', trans))
            .to.be.equal('# hello# )All), I said hi planet! #');
    }

    testShouldWorkCorrectlyWithNoReplacePairs() {
        const trans = {};
        expect(__jymfony.strtr('# \\hi? (all), I said hello world! #', trans))
            .to.be.equal('# \\hi? (all), I said hello world! #');
    }

    testShouldWorkCorrectlyWithFromToStrings() {
        expect(__jymfony.strtr('abcdefg', 'acd', 'ACD'))
            .to.be.equal('AbCDefg');
    }
}
