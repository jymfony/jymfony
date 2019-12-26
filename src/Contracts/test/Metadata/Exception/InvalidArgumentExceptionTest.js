const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;
const { expect } = require('chai');

describe('[Contracts] Metadata.Exception.InvalidArgumentException', function () {
    const messages = [
        [ 'Class NonExistentTestClass does not exist, cannot retrieve its metadata', InvalidArgumentException.CLASS_DOES_NOT_EXIST, 'NonExistentTestClass' ],
        [ 'Unknown reason', 'Unknown reason' ],
        [ 'Printed string', 'Printed %s', 'string' ],
        [ 'Cannot create metadata for non-objects. "number" passed.', InvalidArgumentException.VALUE_IS_NOT_AN_OBJECT, 2 ],
    ];

    let i = 0;
    for (const [ expected, ...args ] of messages) {
        it ('should render correct message #' + ++i, () => {
            expect(InvalidArgumentException.create(...args).message).to.be.equal(expected);
        });
    }
});
