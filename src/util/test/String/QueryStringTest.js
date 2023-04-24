const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class QueryStringTest extends TestCase {
    testBasicFunctionality() {
        __self.assertEquals({a: '1', b: '2', c: '3'}, __jymfony.parse_query_string('a=1&b=2&c=3'));
        __self.assertEquals({
            first: 'abc',
            a: [
                '123',
                'false',
                'last',
            ],
            b: [ 'str' ],
            c: [ '3.5' ],
        }, __jymfony.parse_query_string('first=abc&a[]=123&a[]=false&b[]=str&c[]=3.5&a[]=last'));
        __self.assertEquals({
            arr: {
                '1': 'sid',
                '4': 'bill',
            },
        }, __jymfony.parse_query_string('arr[1]=sid&arr[4]=bill'));
        __self.assertEquals({
            arr: {
                'first': 'sid',
                'forth': 'bill',
            },
        }, __jymfony.parse_query_string('arr[first]=sid&arr[forth]=bill'));
        __self.assertUndefined(__jymfony.parse_query_string('arr[][]=sid&arr[][]=fred'));
    }

    testBadlyFormattedString() {
        __self.assertUndefined(__jymfony.parse_query_string('arr[1=sid&arr[4][2=fred'));
        __self.assertEquals({
            'arr1]': 'sid',
            'arr': {
                '4]2': 'fred',
            },
        }, __jymfony.parse_query_string('arr1]=sid&arr[4]2]=fred'));
        __self.assertUndefined(__jymfony.parse_query_string('arr[one=sid&arr[4][two=fred'));
    }

    testBadlyPercentSignedNumber() {
        __self.assertEquals({first: 'A', second: '%a', third: '%b'}, __jymfony.parse_query_string('first=%41&second=%a&third=%b'));
    }

    testNonBinarySafeName() {
        __self.assertEquals({'arr.test': { 1: 'sid' }, 'arr test': {4: {two: 'fred'}}}, __jymfony.parse_query_string('arr.test[1]=sid&arr test[4][two]=fred'));
    }

    testStringsWithEncodedData() {
        __self.assertEquals({
            'a': '<==  foo bar  ==>',
            'b': '###Hello World###',
        }, __jymfony.parse_query_string('a=%3c%3d%3d%20%20foo+bar++%3d%3d%3e&b=%23%23%23Hello+World%23%23%23'));
    }

    testStringsWithSingleQuote() {
        __self.assertEquals({
            'firstname': 'Bill',
            'surname': 'O\'Reilly',
        }, __jymfony.parse_query_string('firstname=Bill&surname=O%27Reilly'));
    }

    testStringsWithDoubleQuotes() {
        __self.assertEquals({
            'str': 'A string with "quoted" strings',
        }, __jymfony.parse_query_string('str=A+string+with+%22quoted%22+strings'));
    }

    testStringsWithBackslash() {
        __self.assertEquals({
            'sum': '10\\2=5',
        }, __jymfony.parse_query_string('sum=10%5c2%3d5'));
    }

    testStringsWithNullChars() {
        __self.assertEquals({
            'str': 'A string with containing \0\0\0 nulls',
        }, __jymfony.parse_query_string('str=A%20string%20with%20containing%20%00%00%00%20nulls'));
    }
}
