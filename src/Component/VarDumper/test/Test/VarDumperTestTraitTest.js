const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const VarDumperTestTrait = Jymfony.Component.VarDumper.Test.VarDumperTestTrait;

export default class VarDumperTestTraitTest extends mix(TestCase, VarDumperTestTrait) {
    get testCaseName() {
        return '[VarDumper] ' + super.testCaseName;
    }

    testShouldCompareLargeData() {
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

        this.assertDumpEquals(expected, array);
    }

    testShouldAllowNonScalarExpression() {
        this.assertDumpEquals({ bin: 'bum', bam: 'foo' }, { bin: 'bum', bam: 'foo'});
    }

    testShouldAcceptsFormat() {
        this.assertDumpMatchesFormat('{\n  +"bin"%A', { bin: 'bum', bam: 'foo' });
    }
}
