const ConstraintViolation = Jymfony.Component.Validator.ConstraintViolation;
const ConstraintViolationList = Jymfony.Component.Validator.ConstraintViolationList;
const { expect } = require('chai');

describe('[Validator] ConstraintViolationList', function () {
    beforeEach(() => {
        this._list = new ConstraintViolationList();
    });

    const getViolation = (message, root = null, propertyPath = null, code = null) => {
        return new ConstraintViolation(message, message, [], root, propertyPath, null, null, code);
    };

    it ('should be empty', () => {
        expect(this._list).to.have.length(0);
    });

    it ('can be initialized with violation', () => {
        const violation = getViolation('Error');
        this._list = new ConstraintViolationList([ violation ]);

        expect(this._list).to.have.length(1);
        expect(this._list.get(0)).to.be.equal(violation);
    });

    it ('violations can be added', () => {
        const violation = getViolation('Error');
        this._list.add(violation);

        expect(this._list).to.have.length(1);
        expect(this._list.get(0)).to.be.equal(violation);
    });

    it ('another list can be added', () => {
        const violations = [
            getViolation('Error 1'),
            getViolation('Error 2'),
            getViolation('Error 3'),
        ];

        const otherList = new ConstraintViolationList(violations);
        this._list.addAll(otherList);

        expect(this._list).to.have.length(3);

        expect(this._list.get(0)).to.be.equal(violations[0]);
        expect(this._list.get(1)).to.be.equal(violations[1]);
        expect(this._list.get(2)).to.be.equal(violations[2]);
    });

    it ('can be iterated', () => {
        const violations = [
            getViolation('Error 1'),
            getViolation('Error 2'),
            getViolation('Error 3'),
        ];

        this._list = new ConstraintViolationList(violations);
        expect([ ...this._list ]).to.be.deep.equal(violations);
    });

    it ('could be converted to string', () => {
        this._list = new ConstraintViolationList([
            getViolation('Error 1', 'Root'),
            getViolation('Error 2', 'Root', 'foo.bar'),
            getViolation('Error 3', 'Root', '[baz]'),
            getViolation('Error 4', '', 'foo.bar'),
            getViolation('Error 5', '', '[baz]'),
        ]);

        const expected =
`Root:
    Error 1
Root.foo.bar:
    Error 2
Root[baz]:
    Error 3
foo.bar:
    Error 4
[baz]:
    Error 5`;

        expect(String(this._list)).to.be.equal(expected);
    });

    const dataByCodes = [
        [ 'code1', 2 ],
        [ [ 'code1', 'code2' ], 3 ],
        [ 'code3', 0 ],
    ];

    let i = 0;
    for (const [ code, violationsCount ] of dataByCodes) {
        it ('findByCode should work #' + ++i, () => {
            const violations = [
                getViolation('Error', null, null, 'code1'),
                getViolation('Error', null, null, 'code1'),
                getViolation('Error', null, null, 'code2'),
            ];

            const list = new ConstraintViolationList(violations);
            const specificErrors = list.findByCodes(code);

            expect(specificErrors).to.be.instanceOf(ConstraintViolationList);
            expect(specificErrors).to.have.length(violationsCount);
        });
    }
});
