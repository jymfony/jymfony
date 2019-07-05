const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const expect = require('chai').expect;

const referenceObj = {
    null: null,
    undefined: undefined,
    empty: false,
    public: 'pub',
    '\0~\0virtual': 'virt',
    '\0+\0dynamic': 'dyn',
};

describe('[VarDumper] Caster', function () {
    const filterTests = function * () {
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
    };

    let i = 0;
    for (const [ filter, expectedDiff, listedProperties = null ] of filterTests()) {
        it('should filter #' + ++i, () => {
            let filteredObject;
            if (null === listedProperties) {
                filteredObject = Caster.filter(referenceObj, filter);
            } else {
                filteredObject = Caster.filter(referenceObj, filter, listedProperties);
            }

            expect(__jymfony.diff_key(referenceObj, filteredObject[0])).to.be.deep.equal(expectedDiff);
        });
    }
});
