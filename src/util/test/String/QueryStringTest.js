require('../../lib/String/querystring');
const { expect } = require('chai');

describe('Parse query string', function () {
    it('basic functionality', () => {
        expect(__jymfony.parse_query_string('a=1&b=2&c=3'))
            .to.be.deep.equal({a: '1', b: '2', c: '3'});

        expect(__jymfony.parse_query_string('first=abc&a[]=123&a[]=false&b[]=str&c[]=3.5&a[]=last'))
            .to.be.deep.equal({
                first: 'abc',
                a: [
                    '123',
                    'false',
                    'last',
                ],
                b: [ 'str' ],
                c: [ '3.5' ],
            });

        expect(__jymfony.parse_query_string('arr[1]=sid&arr[4]=bill'))
            .to.be.deep.equal({
                arr: {
                    '1': 'sid',
                    '4': 'bill',
                },
            });

        expect(__jymfony.parse_query_string('arr[first]=sid&arr[forth]=bill'))
            .to.be.deep.equal({
                arr: {
                    'first': 'sid',
                    'forth': 'bill',
                },
            });

        expect(__jymfony.parse_query_string('arr[][]=sid&arr[][]=fred'))
            .to.be.undefined;
    });

    it('badly formatted string', () => {
        expect(__jymfony.parse_query_string('arr[1=sid&arr[4][2=fred')).to.be.undefined;
        expect(__jymfony.parse_query_string('arr1]=sid&arr[4]2]=fred'))
            .to.be.deep.equal({
                'arr1]': 'sid',
                'arr': {
                    '4]2': 'fred',
                },
            });
        expect(__jymfony.parse_query_string('arr[one=sid&arr[4][two=fred')).to.be.undefined;
    });

    it('badly %-signed number', () => {
        expect(__jymfony.parse_query_string('first=%41&second=%a&third=%b'))
            .to.be.deep.equal({first: 'A', second: '%a', third: '%b'});
    });

    it('non binary-safe name', () => {
        expect(__jymfony.parse_query_string('arr.test[1]=sid&arr test[4][two]=fred'))
            .to.be.deep.equal({'arr.test': { 1: 'sid' }, 'arr test': {4: {two: 'fred'}}});
    });

    it('strings with encoded data', () => {
        expect(__jymfony.parse_query_string('a=%3c%3d%3d%20%20foo+bar++%3d%3d%3e&b=%23%23%23Hello+World%23%23%23'))
            .to.be.deep.equal({
                'a': '<==  foo bar  ==>',
                'b': '###Hello World###',
            });
    });

    it('strings with single quote', () => {
        expect(__jymfony.parse_query_string('firstname=Bill&surname=O%27Reilly'))
            .to.be.deep.equal({
                'firstname': 'Bill',
                'surname': 'O\'Reilly',
            });
    });

    it('strings with double quotes', () => {
        expect(__jymfony.parse_query_string('str=A+string+with+%22quoted%22+strings'))
            .to.be.deep.equal({
                'str': 'A string with "quoted" strings',
            });
    });

    it('strings with backslash', () => {
        expect(__jymfony.parse_query_string('sum=10%5c2%3d5'))
            .to.be.deep.equal({
                'sum': '10\\2=5',
            });
    });

    it('strings with null chars', () => {
        expect(__jymfony.parse_query_string('str=A%20string%20with%20containing%20%00%00%00%20nulls'))
            .to.be.deep.equal({
                'str': 'A string with containing \0\0\0 nulls',
            });
    });
});
