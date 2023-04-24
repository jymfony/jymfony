const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const referenceObj = {
    null: null,
    undefined: undefined,
    empty: false,
    public: 'pub',
    '\0~\0virtual': 'virt',
    '\0+\0dynamic': 'dyn',
};

export default class CasterTest extends TestCase {
    get testCaseName() {
        return '[VarDumper] ' + super.testCaseName;
    }

    @dataProvider('provideCasterData')
    testShouldFilter(filter, expectedDiff, listedProperties = null) {
        let filteredObject;
        if (null === listedProperties) {
            filteredObject = Caster.filter(referenceObj, filter);
        } else {
            filteredObject = Caster.filter(referenceObj, filter, listedProperties);
        }

        __self.assertEquals(expectedDiff, __jymfony.diff_key(referenceObj, filteredObject[0]));
    }

    * provideCasterData() {
        yield [ 0, {} ];
        yield [ Caster.EXCLUDE_NULL, { null: null, undefined: undefined } ];
        yield [ Caster.EXCLUDE_EMPTY, { null: null, undefined: undefined, empty: false } ];
        yield [ Caster.EXCLUDE_PUBLIC, { null: null, undefined: undefined, empty: false, public: 'pub' } ];
        yield [ Caster.EXCLUDE_VIRTUAL, { '\0~\0virtual': 'virt' } ];
        yield [ Caster.EXCLUDE_DYNAMIC, { '\0+\0dynamic': 'dyn' } ];
        yield [ Caster.EXCLUDE_VERBOSE, { public: 'pub', '\0+\0dynamic': 'dyn' }, [ 'public', '\0+\0dynamic' ] ];
        yield [ Caster.EXCLUDE_NOT_IMPORTANT, { null: null, undefined: undefined, empty: false, '\0~\0virtual': 'virt' }, [ 'public', '\0+\0dynamic' ] ];
        yield [ Caster.EXCLUDE_VIRTUAL | Caster.EXCLUDE_DYNAMIC, { '\0~\0virtual': 'virt', '\0+\0dynamic': 'dyn' } ];
        yield [ Caster.EXCLUDE_VERBOSE | Caster.EXCLUDE_NOT_IMPORTANT, { ...referenceObj }, [ 'public', '\0+\0dynamic' ] ];
        yield [ Caster.EXCLUDE_NOT_IMPORTANT | Caster.EXCLUDE_EMPTY, { null: null, undefined: undefined, empty: false, '\0~\0virtual': 'virt', '\0+\0dynamic': 'dyn' }, [ 'public', 'empty' ] ];
        yield [ Caster.EXCLUDE_VERBOSE | Caster.EXCLUDE_EMPTY | Caster.EXCLUDE_STRICT, { empty: false }, [ 'public', 'empty' ] ];
    }
}
