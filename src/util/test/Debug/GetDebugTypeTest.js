const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class GetDebugTypeTest extends TestCase {
    @dataProvider('provideValues')
    testGetDebugTypeShouldWork(expected, value) {
        __self.assertEquals(expected, __jymfony.get_debug_type(value));
    }

    * provideValues() {
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
        yield [ 'ReflectionException', new Jymfony.Component.Autoloader.Exception.ReflectionException() ];
    }
}
