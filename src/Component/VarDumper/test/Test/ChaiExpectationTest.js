const expect = require('chai').expect;

describe('[VarDumper] ChaiExpectation', function () {
    it('should compare large data', () => {
        const howMany = 700;
        const array = [];
        let expected = __jymfony.sprintf('array:%d [\n', howMany + 1);

        for (let i = 0; i <= howMany; i++) {
            expected += `  ${i} => array:4 [
    0 => "a",
    1 => "b",
    2 => "c",
    3 => "d"
  ]` + (i === howMany ? '\n' : ',\n');

            array.push([ 'a', 'b', 'c', 'd' ]);
        }

        expected += ']\n';

        expect(array).to.dumpsAs(expected);
    });

    it('should allow non scalar expression', () => {
        expect({ bin: 'bum', bam: 'foo'}).to.dumpsAs({ bin: 'bum', bam: 'foo'});
    });
});
