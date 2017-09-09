require('../../lib/Object/equal');
const expect = require('chai').expect;

describe('Equal', function () {

    describe('strings', function () {

        it('returns true for same values', () => {
            expect(__jymfony.equal('x', 'x')).to.be.true;
        });

        it('returns true for different instances with same values', () => {
            expect(__jymfony.equal(new String('x'), new String('x'))).to.be.true;
        });

        it('returns false for literal vs instance with same value', () => {
            expect(__jymfony.equal('x', new String('x'))).to.be.false;
            expect(__jymfony.equal(new String('x'), 'x')).to.be.false;
        });

        it('returns false for different instances with different values', () => {
            expect(__jymfony.equal(new String('x'), new String('y'))).to.be.false;
        });

        it('returns false for different values', () => {
            expect(__jymfony.equal('x', 'y')).to.be.false;
        });

    });

    describe('booleans', function () {

        it('returns true for same values', () => {
            expect(__jymfony.equal(true, true)).to.be.true;
        });

        it('returns true for instances with same value', () => {
            expect(__jymfony.equal(new Boolean(true), new Boolean(true))).to.be.true;
        });

        it('returns false for literal vs instance with same value', () => {
            expect(__jymfony.equal(true, new Boolean(true))).to.be.faòse;
        });

        it('returns false for literal vs instance with different values', () => {
            expect(__jymfony.equal(false, new Boolean(true))).to.be.false;
            expect(__jymfony.equal(new Boolean(false), true)).to.be.false;
        });

        it('returns false for instances with different values', () => {
            expect(__jymfony.equal(new Boolean(false), new Boolean(true))).to.be.false;
            expect(__jymfony.equal(new Boolean(true), new Boolean(false))).to.be.false;
        });

        it('returns false for different values', () => {
            expect(__jymfony.equal(true, false)).to.be.false;
            expect(__jymfony.equal(true, Boolean(false))).to.be.false;
        });

    });

    describe('null', function () {

        it('returns true for two nulls', () => {
            expect(__jymfony.equal(null, null)).to.be.true;
        });

        it('returns false for null, undefined', () => {
            expect(__jymfony.equal(null, undefined)).to.be.false;
        });

        it('doesn\'t crash on weakmap key error', () => {
            expect(__jymfony.equal({}, null)).to.be.false;
        });

    });

    describe('undefined', function () {

        it('returns true for two undefineds', () => {
            expect(__jymfony.equal(undefined, undefined)).to.be.true;
        });

        it('returns false for undefined, null', () => {
            expect(__jymfony.equal(undefined, null)).to.be.false;
        });

    });

    describe('numbers', function () {

        it('returns true for same values', () => {
            expect(__jymfony.equal(-0, -0)).to.be.true;
            expect(__jymfony.equal(+0, +0)).to.be.true;
            expect(__jymfony.equal(0, 0)).to.be.true;
            expect(__jymfony.equal(1, 1)).to.be.true;
            expect(__jymfony.equal(Infinity, Infinity)).to.be.true;
            expect(__jymfony.equal(-Infinity, -Infinity)).to.be.true;
        });

        it('returns false for literal vs instance with same value', () => {
            expect(__jymfony.equal(1, new Number(1))).to.be.false;
        });

        it('returns true NaN vs NaN', () => {
            expect(__jymfony.equal(NaN, NaN)).to.be.true;
        });

        it('returns true for NaN instances', () => {
            expect(__jymfony.equal(new Number(NaN), new Number(NaN))).to.be.true;
        });

        it('returns false on numbers with different signs', () => {
            expect(__jymfony.equal(-1, 1)).to.be.false;
            expect(__jymfony.equal(-0, +0)).to.be.false;
            expect(__jymfony.equal(-Infinity, Infinity)).to.be.false;
        });

        it('returns false on instances with different signs', () => {
            expect(__jymfony.equal(new Number(-1), new Number(1))).to.be.false;
            expect(__jymfony.equal(new Number(-0), new Number(+0))).to.be.false;
            expect(__jymfony.equal(new Number(-Infinity), new Number(Infinity))).to.be.false;
        });

    });

    describe('dates', function () {

        it('returns true given two dates with the same time', () => {
            const dateA = new Date();
            expect(__jymfony.equal(dateA, new Date(dateA.getTime()))).to.be.true;
        });

        it('returns true given two invalid dates', () => {
            expect(__jymfony.equal(new Date(NaN), new Date(NaN))).to.be.true;
        });

        it('returns false given two dates with the different times', () => {
            const dateA = new Date();
            expect(__jymfony.equal(dateA, new Date(dateA.getTime() + 1))).to.be.false;
        });

    });

    describe('regexp', function () {

        it('returns true given two regexes with the same source', () => {
            expect(__jymfony.equal(/\s/, /\s/)).to.be.true;
            expect(__jymfony.equal(/\s/, new RegExp('\\s'))).to.be.true;
        });

        it('returns false given two regexes with different source', () => {
            expect(__jymfony.equal(/^$/, /^/)).to.be.false;
            expect(__jymfony.equal(/^$/, new RegExp('^'))).to.be.false;
        });

        it('returns false given two regexes with different flags', () => {
            expect(__jymfony.equal(/^/m, /^/i)).to.be.false;
        });

    });

    describe('empty types', function () {
        it('returns true on two empty objects', () => {
            expect(__jymfony.equal({}, {})).to.be.true;
        });

        it('returns true on two empty arrays', () => {
            expect(__jymfony.equal([], [])).to.be.true;
        });

        it('returns false on different types', () => {
            expect(__jymfony.equal([], {})).to.be.false;
        });
    });

    describe('class instances', function () {

        it('returns true given two empty class instances', () => {
            class BaseA {}
            expect(__jymfony.equal(new BaseA(), new BaseA())).to.be.true;
        });

        it('returns true given two class instances with same properties', () => {
            class BaseA {
                constructor(prop) {
                    this.prop = prop;
                }
            }

            expect(__jymfony.equal(new BaseA(1), new BaseA(1))).to.be.true;
        });

        it('returns true given two class instances with deeply equal bases', () => {
            class BaseA {}
            class BaseB {}
            BaseA.prototype.foo = { a: 1 };
            BaseB.prototype.foo = { a: 1 };
            expect(__jymfony.equal(new BaseA(), new BaseB())).to.be.true;
        });

        it('returns false given two class instances with different properties', () => {
            class BaseA {
                constructor(prop) {
                    this.prop = prop;
                }
            }
            expect(__jymfony.equal(new BaseA(1), new BaseA(2))).to.be.false;
        });

        it('returns false given two class instances with deeply unequal bases', () => {
            class BaseA {}
            class BaseB {}
            BaseA.prototype.foo = { a: 1 };
            BaseB.prototype.foo = { a: 2 };
            expect(__jymfony.equal(new BaseA(), new BaseB())).to.be.false;
        });

    });

    describe('arguments', function () {
        function getArguments() {
            return arguments;
        }

        it('returns true given two arguments', () => {
            const argumentsA = getArguments();
            const argumentsB = getArguments();
            expect(__jymfony.equal(argumentsA, argumentsB)).to.be.true;
        });

        it('returns true given two arguments with same properties', () => {
            const argumentsA = getArguments(1, 2);
            const argumentsB = getArguments(1, 2);
            expect(__jymfony.equal(argumentsA, argumentsB)).to.be.true;
        });

        it('returns false given two arguments with different properties', () => {
            const argumentsA = getArguments(1, 2);
            const argumentsB = getArguments(3, 4);
            expect(__jymfony.equal(argumentsA, argumentsB)).to.be.false;
        });

        it('returns false given an array', () => {
            expect(__jymfony.equal([], arguments)).to.be.false;
        });

        it('returns false given an object', () => {
            expect(__jymfony.equal({}, arguments)).to.be.false;
        });

    });

    describe('arrays', function () {

        it('returns true with arrays containing same literals', () => {
            expect(__jymfony.equal([ 1, 2, 3 ], [ 1, 2, 3 ])).to.be.true;
            expect(__jymfony.equal([ 'a', 'b', 'c' ], [ 'a', 'b', 'c' ])).to.be.true;
        });

        it('returns true given literal or constructor', () => {
            expect(__jymfony.equal([ 1, 2, 3 ], new Array(1, 2, 3))).to.be.true;
        });

        it('returns false with arrays containing literals in different order', () => {
            expect(__jymfony.equal([ 3, 2, 1 ], [ 1, 2, 3 ])).to.be.false;
        });

        it('returns false for arrays of different length', () => {
            expect(__jymfony.equal(new Array(1), new Array(100))).to.be.false;
        });

    });

    describe('objects', function () {

        it('returns true with objects containing same literals', () => {
            expect(__jymfony.equal({ foo: 1, bar: 2 }, { foo: 1, bar: 2 })).to.be.true;
            expect(__jymfony.equal({ foo: 'baz' }, { foo: 'baz' })).to.be.true;
        });

        it('returns true for deeply nested objects', () => {
            expect(__jymfony.equal({ foo: { bar: 'foo' } }, { foo: { bar: 'foo' } })).to.be.true;
        });

        it('returns true with objects with same circular reference', () => {
            const objectA = { foo: 1 };
            const objectB = { foo: 1 };
            const objectC = { a: objectA, b: objectB };
            objectA.bar = objectC;
            objectB.bar = objectC;
            expect(__jymfony.equal(objectA, objectB)).to.be.true;
        });

        it('returns true with objects with deeply equal prototypes', () => {
            const objectA = Object.create({ foo: { a: 1 } });
            const objectB = Object.create({ foo: { a: 1 } });
            expect(__jymfony.equal(objectA, objectB)).to.be.true;
        });

        it('returns false with objects containing different literals', () => {
            expect(__jymfony.equal({ foo: 1, bar: 1 }, { foo: 1, bar: 2 })).to.be.false;
            expect(__jymfony.equal({ foo: 'bar' }, { foo: 'baz' })).to.be.false;
            expect(__jymfony.equal({ foo: { bar: 'foo' } }, { foo: { bar: 'baz' } })).to.be.false;
        });

        it('returns false with objects containing different keys', () => {
            expect(__jymfony.equal({ foo: 1, bar: 1 }, { foo: 1, baz: 2 })).to.be.false;
            expect(__jymfony.equal({ foo: 'bar' }, { bar: 'baz' })).to.be.false;
        });

        it('returns true with circular objects', () => {
            const objectA = { foo: 1 };
            const objectB = { foo: 1 };
            objectA.bar = objectB;
            objectB.bar = objectA;
            expect(__jymfony.equal(objectA, objectB)).to.be.true;
        });

        it('returns true with frozen objects', () => {
            const objectA = Object.freeze({ foo: 1 });
            const objectB = Object.freeze({ foo: 1 });
            expect(__jymfony.equal(objectA, objectB)).to.be.true;
        });

        it('returns false with objects with deeply unequal prototypes', () => {
            const objectA = Object.create({ foo: { a: 1 } });
            const objectB = Object.create({ foo: { a: 2 } });
            expect(__jymfony.equal(objectA, objectB)).to.be.false;
        });

    });

    describe('functions', function () {

        it('returns true for same functions', () => {
            function foo() {}
            expect(__jymfony.equal(foo, foo)).to.be.true;
        });

        it('returns false for different functions', () => {
            expect(__jymfony.equal(function foo() {}, function bar() {})).to.be.false;
        });

    });

    describe('errors', function () {

        it('returns true for same errors', () => {
            const error = new Error('foo');
            expect(__jymfony.equal(error, error)).to.be.true;
        });

        it('returns false for different errors', () => {
            expect(__jymfony.equal(new Error('foo'), new Error('foo'))).to.be.false;
        });

    });

    describe('buffers', function () {
        it('returns true for same buffers', () => {
            expect(__jymfony.equal(new Buffer([ 1 ]), new Buffer([ 1 ]))).to.be.true;
        });

        it('returns false for different buffers', () => {
            expect(__jymfony.equal(new Buffer([ 1 ]), new Buffer([ 2 ]))).to.be.false;
        });
    });


    describe('string iterator', function () {

        it('returns true for Strings with same entries', () => {
            expect(__jymfony.equal('abc'[Symbol.iterator](), 'abc'[Symbol.iterator]())).to.be.true;
        });

        it('returns false for Strings with different entries', () => {
            expect(__jymfony.equal('abc'[Symbol.iterator](), 'def'[Symbol.iterator]())).to.be.false;
        });

    });

    describe('array iterator', function () {

        it('returns true for Arrays with same entries', function () {
            expect(__jymfony.equal([ 1, 2, 3 ][Symbol.iterator](), [ 1, 2, 3 ][Symbol.iterator]())).to.be.true;
        });

        it('returns false for Arrays with different entries', function () {
            expect(__jymfony.equal([ 1, 2, 3 ][Symbol.iterator](), [ 4, 5, 6 ][Symbol.iterator]())).to.be.false;
        });

    });

    describe('array iterator (entries)', function () {

        it('returns true for Arrays with same entries', function () {
            expect(__jymfony.equal([ 1, 2, 3 ].entries(), [ 1, 2, 3 ].entries())).to.be.true;
        });

        it('returns false for Arrays with different entries', function () {
            expect(__jymfony.equal([ 1, 2, 3 ].entries(), [ 4, 5, 6 ].entries())).to.be.false;
        });

    });

    describe('maps', function () {

        it('returns true for Maps with same entries', () => {
            const mapA = new Map();
            const mapB = new Map();
            mapA.set('a', 1);
            mapA.set('b', 2);
            mapA.set('c', 3);
            mapB.set('c', 3);
            mapB.set('b', 2);
            mapB.set('a', 1);
            expect(__jymfony.equal(mapA, mapB)).to.be.true;
        });

        it('returns false for Maps with different entries', () => {
            const mapA = new Map();
            const mapB = new Map();
            mapA.set('a', 1);
            mapB.set('a', 2);
            mapA.set('b', 3);
            mapB.set('b', 4);
            mapA.set('c', 5);
            mapB.set('c', 6);
            expect(__jymfony.equal(mapA, mapB)).to.be.false;
        });

    });

    describe('map iterator', function () {

        it('returns true for Map iterators with same entries', () => {
            const mapA = new Map();
            const mapB = new Map();
            mapA.set('a', 1);
            mapB.set('a', 1);
            mapA.set('b', 2);
            mapB.set('b', 2);
            mapA.set('c', 3);
            mapB.set('c', 3);
            expect(__jymfony.equal(mapA[Symbol.iterator](), mapB[Symbol.iterator]())).to.be.true;
        });

        it('returns false for Map iterators with different entries', () => {
            const mapA = new Map();
            const mapB = new Map();
            mapA.set('a', 1);
            mapB.set('a', 2);
            mapA.set('b', 3);
            mapB.set('b', 4);
            mapA.set('c', 5);
            mapB.set('c', 6);
            expect(__jymfony.equal(mapA[Symbol.iterator](), mapB[Symbol.iterator]())).to.be.false;
        });

    });

    describe('map iterator (entries)', function () {

        it('returns true for Map iterators with same entries', () => {
            const mapA = new Map();
            const mapB = new Map();
            mapA.set('a', 1);
            mapB.set('a', 1);
            mapA.set('b', 2);
            mapB.set('b', 2);
            mapA.set('c', 3);
            mapB.set('c', 3);
            expect(__jymfony.equal(mapA.entries(), mapB.entries())).to.be.true;
        });

        it('returns false for Map iterators with different entries', () => {
            const mapA = new Map();
            const mapB = new Map();
            mapA.set('a', 1);
            mapB.set('a', 2);
            mapA.set('b', 3);
            mapB.set('b', 4);
            mapA.set('c', 5);
            mapB.set('c', 6);
            expect(__jymfony.equal(mapA.entries(), mapB.entries())).to.be.false;
        });

    });

    describe('weakmaps', function () {

        it('returns true for same WeakMaps', () => {
            const weakMap = new WeakMap();
            expect(__jymfony.equal(weakMap, weakMap)).to.be.true;
        });

        it('returns false for different WeakMaps', () => {
            expect(__jymfony.equal(new WeakMap(), new WeakMap())).to.be.false;
        });

    });

    describe('sets', function () {

        it('returns true for Sets with same entries', () => {
            const setA = new Set();
            const setB = new Set();
            setA.add('a');
            setA.add('b');
            setA.add('c');
            setB.add('a');
            setB.add('b');
            setB.add('c');
            expect(__jymfony.equal(setA, setB)).to.be.true;
        });

        it('returns true for Sets with same entries in different order', () => {
            const setA = new Set();
            const setB = new Set();
            setA.add('a');
            setA.add('b');
            setA.add('c');
            setB.add('b');
            setB.add('c');
            setB.add('a');
            expect(__jymfony.equal(setA, setB)).to.be.true;
        });

        it('returns true for Sets with nested entries', () => {
            const setA = new Set();
            const setB = new Set();
            setA.add([ [], [], [] ]);
            setB.add([ [], [], [] ]);
            expect(__jymfony.equal(setA, setB)).to.be.true;
        });

        it('returns true for Sets with same circular references', () => {
            const setA = new Set();
            const setB = new Set();
            const setC = new Set();
            setA.add(setC);
            setB.add(setC);
            setC.add(setA);
            setC.add(setB);
            expect(__jymfony.equal(setA, setB)).to.be.true;
        });

        it('returns false for Sets with different entries', () => {
            const setA = new Set();
            const setB = new Set();
            setA.add('a');
            setA.add('b');
            setA.add('c');
            setB.add('d');
            setB.add('e');
            setB.add('f');
            expect(__jymfony.equal(setA, setB)).to.be.false;
        });

        it('returns true for circular Sets', () => {
            const setA = new Set();
            const setB = new Set();
            setA.add(setB);
            setB.add(setA);
            expect(__jymfony.equal(setA, setB)).to.be.true;
        });

    });

    describe('set iterator', function () {

        it('returns true for Sets with same entries', () => {
            const setA = new Set();
            const setB = new Set();
            setA.add('a');
            setA.add('b');
            setA.add('c');
            setB.add('c');
            setB.add('b');
            setB.add('a');
            expect(__jymfony.equal(setA[Symbol.iterator](), setB[Symbol.iterator]())).to.be.true;
        });

        it('returns false for Sets with different entries', () => {
            const setA = new Set();
            const setB = new Set();
            setA.add('a');
            setA.add('b');
            setA.add('c');
            setB.add('d');
            setB.add('e');
            setB.add('f');
            expect(__jymfony.equal(setA[Symbol.iterator](), setB[Symbol.iterator]())).to.be.false;
        });

    });

    describe('set iterator (entries)', function () {

        it('returns true for Sets with same entries', () => {
            const setA = new Set();
            const setB = new Set();
            setA.add('a');
            setA.add('b');
            setA.add('c');
            setB.add('c');
            setB.add('b');
            setB.add('a');
            expect(__jymfony.equal(setA.entries(), setB.entries())).to.be.true;
        });

        it('returns false for Sets with different entries', () => {
            const setA = new Set();
            const setB = new Set();
            setA.add('a');
            setA.add('b');
            setA.add('c');
            setB.add('d');
            setB.add('e');
            setB.add('f');
            expect(__jymfony.equal(setA.entries(), setB.entries())).to.be.false;
        });

    });

    describe('weaksets', function () {

        it('returns true for same WeakSets', () => {
            const weakSet = new WeakSet();
            expect(__jymfony.equal(weakSet, weakSet)).to.be.true;
        });

        it('returns false for different WeakSets', () => {
            expect(__jymfony.equal(new WeakSet(), new WeakSet())).to.be.false;
        });

    });

    describe('symbol', function () {

        it('returns true for the same symbols', () => {
            const sym = Symbol();
            expect(__jymfony.equal(sym, sym)).to.be.true;
            expect(__jymfony.equal(Symbol.iterator, Symbol.iterator)).to.be.true;
        });

        it('returns false for different symbols', () => {
            expect(__jymfony.equal(Symbol(), Symbol())).to.be.false;
        });

    });

    describe('promise', function () {

        it('returns true for the same promises', () => {
            const promiseResolve = Promise.resolve();
            const promiseReject = Promise.reject();
            const promisePending = new Promise(() => {});
            expect(__jymfony.equal(promiseResolve, promiseResolve)).to.be.true;
            expect(__jymfony.equal(promiseReject, promiseReject)).to.be.true;
            expect(__jymfony.equal(promisePending, promisePending)).to.be.true;
        });


        it('returns false for different promises', () => {
            expect(__jymfony.equal(Promise.resolve(), Promise.resolve())).to.be.false;
            expect(__jymfony.equal(Promise.reject(), Promise.reject())).to.be.false;
            expect(__jymfony.equal(new Promise(() => {}), new Promise(() => {}))).to.be.false;
        });

    });

    describe('int8array', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new Int8Array(1, 2, 3, 4), new Int8Array(1, 2, 3, 4))).to.be.true;
        });

        it('returns false for arrays with different values', () => {
            expect(__jymfony.equal(new Int8Array(1, 2, 3, 4), new Int8Array(5, 6, 7, 8))).to.be.false;
            expect(__jymfony.equal(new Int8Array(1, 2, 3, 4), new Int8Array(4, 2, 3, 4))).to.be.false;
        });

    });

    describe('uint8array', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new Uint8Array(1, 2, 3, 4), new Uint8Array(1, 2, 3, 4))).to.be.true;
        });

        it('returns false for arrays with different values', function () {
            expect(__jymfony.equal(new Uint8Array(1, 2, 3, 4), new Uint8Array(5, 6, 7, 8))).to.be.false;
            expect(__jymfony.equal(new Uint8Array(1, 2, 3, 4), new Uint8Array(4, 2, 3, 4))).to.be.false;
        });

    });

    describe('uint8clampedarray', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(1, 2, 3, 4))).to.be.true;
        });

        it('returns false for arrays with different values', () => {
            expect(__jymfony.equal(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(5, 6, 7, 8))).to.be.false;
            expect(__jymfony.equal(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(4, 2, 3, 4))).to.be.false;
        });

    });

    describe('int16array', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new Int16Array(1, 2, 3, 4), new Int16Array(1, 2, 3, 4))).to.be.true;
        });

        it('returns false for arrays with different values', () => {
            expect(__jymfony.equal(new Int16Array(1, 2, 3, 4), new Int16Array(5, 6, 7, 8))).to.be.false;
            expect(__jymfony.equal(new Int16Array(1, 2, 3, 4), new Int16Array(4, 2, 3, 4))).to.be.false;
        });

    });

    describe('uint16array', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new Uint16Array(1, 2, 3, 4), new Uint16Array(1, 2, 3, 4))).to.be.true;
        });

        it('returns false for arrays with different values', () => {
            expect(__jymfony.equal(new Uint16Array(1, 2, 3, 4), new Uint16Array(5, 6, 7, 8))).to.be.false;
            expect(__jymfony.equal(new Uint16Array(1, 2, 3, 4), new Uint16Array(4, 2, 3, 4))).to.be.false;
        });

    });

    describe('int32array', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new Int32Array(1, 2, 3, 4), new Int32Array(1, 2, 3, 4))).to.be.true;
        });

        it('returns false for arrays with different values', () => {
            expect(__jymfony.equal(new Int32Array(1, 2, 3, 4), new Int32Array(5, 6, 7, 8))).to.be.false;
            expect(__jymfony.equal(new Int32Array(1, 2, 3, 4), new Int32Array(4, 2, 3, 4))).to.be.false;
        });

    });

    describe('uint32array', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new Uint32Array(1, 2, 3, 4), new Uint32Array(1, 2, 3, 4))).to.be.true;
        });

        it('returns false for arrays with different values', () => {
            expect(__jymfony.equal(new Uint32Array(1, 2, 3, 4), new Uint32Array(5, 6, 7, 8))).to.be.false;
            expect(__jymfony.equal(new Uint32Array(1, 2, 3, 4), new Uint32Array(4, 2, 3, 4))).to.be.false;
        });

    });

    describe('float32array', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new Float32Array(1, 2, 3, 4), new Float32Array(1, 2, 3, 4))).to.be.true;
        });

        it('returns false for arrays with different values', () => {
            expect(__jymfony.equal(new Float32Array(1, 2, 3, 4), new Float32Array(5, 6, 7, 8))).to.be.false;
            expect(__jymfony.equal(new Float32Array(1, 2, 3, 4), new Float32Array(4, 2, 3, 4))).to.be.false;
        });

    });

    describe('float64array', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new Float64Array(1, 2, 3, 4), new Float64Array(1, 2, 3, 4))).to.be.true;
        });

        it('returns false for arrays with different values', () => {
            expect(__jymfony.equal(new Float64Array(1, 2, 3, 4), new Float64Array(5, 6, 7, 8))).to.be.false;
            expect(__jymfony.equal(new Float64Array(1, 2, 3, 4), new Float64Array(4, 2, 3, 4))).to.be.false;
        });

    });

    describe('arraybuffer', function () {

        it('returns true for arrays with same values', () => {
            expect(__jymfony.equal(new ArrayBuffer(1), new ArrayBuffer(1))).to.be.true;
        });

        it('returns false for arrays with different lengths', () => {
            expect(__jymfony.equal(new ArrayBuffer(1), new ArrayBuffer(4))).to.be.false;
        });

    });

    describe('arrow function', function () {

        it('returns true for same arrow functions', () => {
            const arrow = () => {};
            expect(__jymfony.equal(arrow, arrow)).to.be.true;
        });

        it('returns false for different arrow functions', () => {
            expect(__jymfony.equal(() => {}, () => {})).to.be.false;
        });

    });

    describe('generator function', function () {

        it('returns true for same arrow functions', () => {
            const generator = function * generator() {};
            expect(__jymfony.equal(generator, generator)).to.be.true;
        });

        it('returns false for different arrow functions', () => {
            expect(__jymfony.equal(function * () {}, function * () {})).to.be.false;
        });

    });

    describe('generator', function () {

        it('returns true for same generator function calls', () => {
            const generator = function * () { yield 1; yield 2; };
            expect(__jymfony.equal(generator(), generator())).to.be.true;
        });

        it('returns true for different generator function calls that return same results', () => {
            const generatorA = function * () { yield 1; yield 2; };
            const generatorB = function * () { yield 1; yield 2; };
            expect(__jymfony.equal(generatorA(), generatorB())).to.be.true;
        });

        it('returns true for different generator function calls are at level of iteration with same results', () => {
            const generatorA = function * () { yield 1; yield 2; yield 3; };
            const generatorB = function * () { yield 6; yield 2; yield 3; };
            const generatorAIterator = generatorA();
            const generatorBIterator = generatorB();
            generatorAIterator.next();
            generatorBIterator.next();
            expect(__jymfony.equal(generatorAIterator, generatorBIterator)).to.be.true;
        });

        it('returns false for same generator function calls that return different results', () => {
            let set = 0;
            const generator = function * () { yield set++; };
            expect(__jymfony.equal(generator(), generator())).to.be.false;
        });

        it('returns false for generators at different stages of iteration', () => {
            const generatorA = function * () { yield 1; yield 2; };
            const generatorB = function * () { yield 1; yield 2; };
            const generatorBIterator = generatorB();
            generatorBIterator.next();
            expect(__jymfony.equal(generatorA(), generatorBIterator)).to.be.false;
        });

        it('returns false for generators if one is done', () => {
            const generatorA = function * () { yield 1; yield 2; };
            const generatorB = function * () { yield 1; yield 2; };
            const generatorBIterator = generatorB();
            generatorBIterator.next();
            generatorBIterator.next();
            generatorBIterator.next();
            expect(__jymfony.equal(generatorA(), generatorBIterator)).to.be.false;
        });

    });
});
