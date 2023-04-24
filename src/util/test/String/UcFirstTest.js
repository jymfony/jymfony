const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class UcFirstTest extends TestCase {
    testUcfirstShouldUpperCaseOnlyTheFirstChar() {
        const testStrings = [
            'hey',
            'mate',
            'what\'s',
            'up?',
            'Everything',
            'iS',
            'goOD?',
            'YES',
            'IT',
            'IS',
        ];

        const expectedStrings = [
            'Hey',
            'Mate',
            'What\'s',
            'Up?',
            'Everything',
            'IS',
            'GoOD?',
            'YES',
            'IT',
            'IS',
        ];

        for (let i = 0; i < testStrings.length; ++i) {
            __self.assertEquals(expectedStrings[i], __jymfony.ucfirst(testStrings[i]));
        }
    }
}
