const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const VarCloner = Jymfony.Component.VarDumper.Cloner.VarCloner;

export default class VarClonerTest extends TestCase {
    get testCaseName() {
        return '[VarDumper] ' + super.testCaseName;
    }

    testShouldCloneCorrectlyTheSameObjectInDifferentClonerInstances() {
        const o = new class {} ();

        const cloner1 = new VarCloner();
        const cloner2 = new VarCloner();

        __self.assertEquals(cloner2.cloneVar(o), cloner1.cloneVar(o));
    }
}
