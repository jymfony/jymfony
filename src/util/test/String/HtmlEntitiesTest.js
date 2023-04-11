const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class HtmlEntitiesTest extends TestCase {
    @dataProvider('provideValues')
    testShouldPassExample(expected, original, quoteStyle) {
        __self.assertEquals(expected, __jymfony.htmlentities(original, quoteStyle));
    }

    * provideValues() {
        yield [ 'Kevin &amp; van Zonneveld', 'Kevin & van Zonneveld' ];
        yield [ 'foo&#39;bar', 'foo\'bar', 'ENT_QUOTES' ];
    }
}
