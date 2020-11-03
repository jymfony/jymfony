require('../../lib/String/punycode');
const { expect } = require('chai');

const data = [
    {
        decoded: 'ma\xF1ana.com',
        encoded: 'xn--maana-pta.com',
    },
    {
        decoded: 'example.com.',
        encoded: 'example.com.',
    },
    {
        decoded: 'b\xFCcher.com',
        encoded: 'xn--bcher-kva.com',
    },
    {
        decoded: 'caf\xE9.com',
        encoded: 'xn--caf-dma.com',
    },
    {
        decoded: '\u2603-\u2318.com',
        encoded: 'xn----dqo34k.com',
    },
    {
        decoded: '\uD400\u2603-\u2318.com',
        encoded: 'xn----dqo34kn65z.com',
    },
    {
        description: 'Emoji',
        decoded: '\uD83D\uDCA9.la',
        encoded: 'xn--ls8h.la',
    },
    {
        description: 'Non-printable ASCII',
        decoded: '\0\x01\x02foo.bar',
        encoded: '\0\x01\x02foo.bar',
    },
    {
        description: 'Using U+002E as separator',
        decoded: 'ma\xF1ana\x2Ecom',
        encoded: 'xn--maana-pta.com',
    },
    {
        description: 'Using U+3002 as separator',
        decoded: 'ma\xF1ana\u3002com',
        encoded: 'xn--maana-pta.com',
    },
    {
        description: 'Using U+FF0E as separator',
        decoded: 'ma\xF1ana\uFF0Ecom',
        encoded: 'xn--maana-pta.com',
    },
    {
        description: 'Using U+FF61 as separator',
        decoded: 'ma\xF1ana\uFF61com',
        encoded: 'xn--maana-pta.com',
    },
];

describe('Punycode: encode to ascii', function () {
    for (const object of data) {
        it(object.description || object.decoded, () => {
            expect(__jymfony.punycode_to_ascii(object.decoded)).to.be.equal(object.encoded);
        });
    }
});
