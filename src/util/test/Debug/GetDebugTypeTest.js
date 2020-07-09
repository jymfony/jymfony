require('../../lib/Debug/get_debug_type');
const { expect } = require('chai');

describe('get_debug_type', function () {
    const tests = function * () {
        yield [ 'null', null ];
        yield [ 'undefined', undefined ];

        yield [ 'boolean', true ];
        yield [ 'boolean', false ];
        yield [ 'boolean', new Boolean(true) ];

        yield [ 'string', 'string' ];
        yield [ 'string', new String('xyz') ];

        yield [ 'number', 1 ];
        yield [ 'number', 1.5 ];
        yield [ 'number', new Number(.28) ];

        yield [ 'array', [] ];
        yield [ 'array', [ 'with_value' ] ];
        yield [ 'object', {} ];
        yield [ 'object', { value: 'with_value' } ];

        yield [ 'Exception', new Exception() ];
        yield [ 'Jymfony.Component.Autoloader.Exception.ReflectionException', new Jymfony.Component.Autoloader.Exception.ReflectionException() ];
    };

    let i = 0;
    for (const [ expected, value ] of tests()) {
        it('get_debug_type should work #'+ (++i), () => {
            expect(__jymfony.get_debug_type(value)).to.be.equal(expected);
        });
    }
});
