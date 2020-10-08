const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const DateTime = Jymfony.Component.DateTime.DateTime;
const { expect } = require('chai');

class TestToStringObject {
    toString() {
        return 'ccc';
    }
}

describe('[Validator] ConstraintValidator', function () {
    const toString = new TestToStringObject();

    const data = [
        [ 'true', true ],
        [ 'false', false ],
        [ 'null', null ],
        [ '"foo"', 'foo' ],
        [ 'array', [] ],
        [ 'object', {} ],
        [ 'object', toString ],
        [ 'ccc', toString, ConstraintValidator.OBJECT_TO_STRING ],
        [ 'object', new DateTime('1971-02-02T08:00:00UTC') ],
        [ 'October 04, 19 11:02 am', new DateTime('2019-10-04T11:02:03+09:00'), ConstraintValidator.PRETTY_DATE ],
        [ 'February 02, 71 08:00 am', new DateTime('1971-02-02T08:00:00UTC'), ConstraintValidator.PRETTY_DATE ],
    ];

    let i = 0;
    for (const [ asText, object, flags ] of data) {
        it('should format values correctly #' + ++i, () => {
            const validator = new class extends ConstraintValidator {
                validate() { }
            }();

            expect(validator._formatValue(object, flags)).to.be.equal(asText);
        });
    }
});
