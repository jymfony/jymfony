const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class PunycodeTest extends TestCase {
    @dataProvider('provideData')
    testShouldWork(decoded, encoded, description) {
        __self.assertEquals(encoded, __jymfony.punycode_to_ascii(decoded), description);
    }

    * provideData() {
        yield [ 'ma\xF1ana.com', 'xn--maana-pta.com' ];
        yield [ 'example.com.', 'example.com.' ];
        yield [ 'b\xFCcher.com', 'xn--bcher-kva.com' ];
        yield [ 'caf\xE9.com', 'xn--caf-dma.com' ];
        yield [ '\u2603-\u2318.com', 'xn----dqo34k.com' ];
        yield [ '\uD400\u2603-\u2318.com', 'xn----dqo34kn65z.com' ];
        yield [ '\uD83D\uDCA9.la', 'xn--ls8h.la', 'Emoji' ];
        yield [ '\0\x01\x02foo.bar', '\0\x01\x02foo.bar', 'Non-printable ASCII' ];
        yield [ 'ma\xF1ana\x2Ecom', 'xn--maana-pta.com', 'Using U+002E as separator' ];
        yield [ 'ma\xF1ana\u3002com', 'xn--maana-pta.com', 'Using U+3002 as separator' ];
        yield [ 'ma\xF1ana\uFF0Ecom', 'xn--maana-pta.com', 'Using U+FF0E as separator' ];
        yield [ 'ma\xF1ana\uFF61com', 'xn--maana-pta.com', 'Using U+FF61 as separator' ];
    }
}
