const { expect } = require('chai');

describe('Uppercase first words characters', function () {
    const testLowerCase =
`lorem ipsum dolor sit amet, consectetur adipiscing elit.
vivamus pretium nibh quis purus congue malesuada.
aliquam euismod ornare libero, a aliquet felis gravida at.
donec justo sem, bibendum quis pellentesque dignissim, dignissim a sapien.
sed in lorem odio. aliquam ut velit consectetur, eleifend tellus et, placerat ante.
morbi quis lobortis sapien.
donec non quam ut augue ullamcorper bibendum.
proin ut iaculis orci.
vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
praesent nec auctor risus.`;

    const testSomeLowerSomeUpper =
`Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Vivamus pretium nibh quis purus congue malesuada.
Aliquam euismod ornare libero, a aliquet felis gravida at.
Donec justo sem, bibendum quis pellentesque dignissim, dignissim a sapien.
Sed in lorem odio. Aliquam ut velit consectetur, eleifend tellus et, placerat ante.
Morbi quis lobortis sapien.
Donec non quam ut augue ullamcorper bibendum.
Proin ut iaculis orci.
Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
Praesent nec auctor risus.`;

    const expected =
`Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.
Vivamus Pretium Nibh Quis Purus Congue Malesuada.
Aliquam Euismod Ornare Libero, A Aliquet Felis Gravida At.
Donec Justo Sem, Bibendum Quis Pellentesque Dignissim, Dignissim A Sapien.
Sed In Lorem Odio. Aliquam Ut Velit Consectetur, Eleifend Tellus Et, Placerat Ante.
Morbi Quis Lobortis Sapien.
Donec Non Quam Ut Augue Ullamcorper Bibendum.
Proin Ut Iaculis Orci.
Vestibulum Ante Ipsum Primis In Faucibus Orci Luctus Et Ultrices Posuere Cubilia Curae;
Praesent Nec Auctor Risus.`;

    it('ucwords should upper case every word contained in the specified string', () => {
        expect(__jymfony.ucwords(testLowerCase)).to.be.equal(expected);
        expect(__jymfony.ucwords(testSomeLowerSomeUpper)).to.be.equal(expected);
    });


    const testUpperCase =
`LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.
VIVAMUS PRETIUM NIBH QUIS PURUS CONGUE MALESUADA.
ALIQUAM EUISMOD ORNARE LIBERO, A ALIQUET FELIS GRAVIDA AT.
DONEC JUSTO SEM, BIBENDUM QUIS PELLENTESQUE DIGNISSIM, DIGNISSIM A SAPIEN.
SED IN LOREM ODIO. ALIQUAM UT VELIT CONSECTETUR, ELEIFEND TELLUS ET, PLACERAT ANTE.
MORBI QUIS LOBORTIS SAPIEN.
DONEC NON QUAM UT AUGUE ULLAMCORPER BIBENDUM.
PROIN UT IACULIS ORCI.
VESTIBULUM ANTE IPSUM PRIMIS IN FAUCIBUS ORCI LUCTUS ET ULTRICES POSUERE CUBILIA CURAE;
PRAESENT NEC AUCTOR RISUS.`;

    it('ucwords over an already upper cased string should return the same string', () => {
        expect(__jymfony.ucwords(testUpperCase)).to.be.equal(testUpperCase);
    });
});
