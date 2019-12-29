const { expect } = require('chai');

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

        expect(array).to.dump.as(expected);
    });

    it('should allow non scalar expression', () => {
        expect({ bin: 'bum', bam: 'foo'}).to.dump.as({ bin: 'bum', bam: 'foo'});
    });

    it('should accepts format', () => {
        expect({ bin: 'bum', bam: 'foo'}).to.dump.as.format('{\n  +"bin"%A');
    });
});
