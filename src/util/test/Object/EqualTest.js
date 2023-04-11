const TestCase = Jymfony.Component.Testing.Framework.TestCase;

function getArguments() {
    // eslint-disable-next-line prefer-rest-params
    return arguments;
}

export default class EqualTest extends TestCase {
    testReturnsTrueForSameStrings() {
        __self.assertTrue(__jymfony.equal('x', 'x'));
    }

    testReturnsTrueForDifferentInstancesWithSameValues() {
        __self.assertTrue(__jymfony.equal(new String('x'), new String('x')));
    }

    testReturnsFalseForStringLiteralVsInstanceWithSameValue() {
        __self.assertFalse(__jymfony.equal('x', new String('x')));
        __self.assertFalse(__jymfony.equal(new String('x'), 'x'));
    }

    testReturnsFalseForDifferentInstancesWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new String('x'), new String('y')));
    }

    testReturnsFalseForDifferentStrings() {
        __self.assertFalse(__jymfony.equal('x', 'y'));
    }

    testReturnsTrueForSameBooleans() {
        __self.assertTrue(__jymfony.equal(true, true));
    }

    testReturnsTrueForInstancesWithSameValue() {
        __self.assertTrue(__jymfony.equal(new Boolean(true), new Boolean(true)));
    }

    testReturnsFalseForBooleanLiteralVsInstanceWithSameValue() {
        __self.assertFalse(__jymfony.equal(true, new Boolean(true)));
    }

    testReturnsFalseForLiteralVsInstanceWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(false, new Boolean(true)));
        __self.assertFalse(__jymfony.equal(new Boolean(false), true));
    }

    testReturnsFalseForInstancesWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Boolean(false), new Boolean(true)));
        __self.assertFalse(__jymfony.equal(new Boolean(true), new Boolean(false)));
    }

    testReturnsFalseForDifferentBooleans() {
        __self.assertFalse(__jymfony.equal(true, false));
        __self.assertFalse(__jymfony.equal(true, Boolean(false)));
    }

    testReturnsTrueForTwoNulls() {
        __self.assertTrue(__jymfony.equal(null, null));
    }

    testReturnsFalseForNullAndUndefined() {
        __self.assertFalse(__jymfony.equal(null, undefined));
    }

    testDoesNotCrashOnWeakmapKeyError() {
        __self.assertFalse(__jymfony.equal({}, null));
    }

    testReturnsTrueForTwoUndefined() {
        __self.assertTrue(__jymfony.equal(undefined, undefined));
    }

    testReturnsFalseForUndefinedAndNull() {
        __self.assertFalse(__jymfony.equal(undefined, null));
    }

    testReturnsTrueForSameNumbers() {
        __self.assertTrue(__jymfony.equal(-0, -0));
        __self.assertTrue(__jymfony.equal(+0, +0));
        __self.assertTrue(__jymfony.equal(0, 0));
        __self.assertTrue(__jymfony.equal(1, 1));
        __self.assertTrue(__jymfony.equal(Infinity, Infinity));
        __self.assertTrue(__jymfony.equal(-Infinity, -Infinity));
    }

    testReturnsFalseForNumberLiteralVsInstanceWithSameValue() {
        __self.assertFalse(__jymfony.equal(1, new Number(1)));
    }

    testReturnsTrueNaNVsNaN() {
        __self.assertTrue(__jymfony.equal(NaN, NaN));
    }

    testReturnsTrueForNaNInstances() {
        __self.assertTrue(__jymfony.equal(new Number(NaN), new Number(NaN)));
    }

    testReturnsFalseOnNumbersWithDifferentSigns() {
        __self.assertFalse(__jymfony.equal(-1, 1));
        __self.assertFalse(__jymfony.equal(-0, +0));
        __self.assertFalse(__jymfony.equal(-Infinity, Infinity));
    }

    testReturnsFalseOnInstancesWithDifferentSigns() {
        __self.assertFalse(__jymfony.equal(new Number(-1), new Number(1)));
        __self.assertFalse(__jymfony.equal(new Number(-0), new Number(+0)));
        __self.assertFalse(__jymfony.equal(new Number(-Infinity), new Number(Infinity)));
    }

    testReturnsTrueGivenTwoDatesWithTheSameTime() {
        const dateA = new Date();
        __self.assertTrue(__jymfony.equal(dateA, new Date(dateA.getTime())));
    }

    testReturnsTrueGivenTwoInvalidDates() {
        __self.assertTrue(__jymfony.equal(new Date(NaN), new Date(NaN)));
    }

    testReturnsFalseGivenTwoDatesWithTheDifferentTimes() {
        const dateA = new Date();
        __self.assertFalse(__jymfony.equal(dateA, new Date(dateA.getTime() + 1)));
    }

    testReturnsTrueGivenTwoRegexesWithTheSameSource() {
        __self.assertTrue(__jymfony.equal(/\s/, /\s/));
        __self.assertTrue(__jymfony.equal(/\s/, new RegExp('\\s')));
    }

    testReturnsFalseGivenTwoRegexesWithDifferentSource() {
        __self.assertFalse(__jymfony.equal(/^$/, /^/));
        __self.assertFalse(__jymfony.equal(/^$/, new RegExp('^')));
    }

    testReturnsFalseGivenTwoRegexesWithDifferentFlags() {
        __self.assertFalse(__jymfony.equal(/^/m, /^/i));
    }

    testReturnsTrueOnTwoEmptyObjects() {
        __self.assertTrue(__jymfony.equal({}, {}));
    }

    testReturnsTrueOnTwoEmptyArrays() {
        __self.assertTrue(__jymfony.equal([], []));
    }

    testReturnsFalseOnDifferentTypes() {
        __self.assertFalse(__jymfony.equal([], {}));
    }

    testReturnsTrueGivenTwoEmptyClassInstances() {
        class BaseA {}
        __self.assertTrue(__jymfony.equal(new BaseA(), new BaseA()));
    }

    testReturnsTrueGivenTwoClassInstancesWithSameProperties() {
        class BaseA {
            constructor(prop) {
                this.prop = prop;
            }
        }

        __self.assertTrue(__jymfony.equal(new BaseA(1), new BaseA(1)));
    }

    testReturnsTrueGivenTwoClassInstancesWithDeeplyEqualBases() {
        class BaseA {}
        class BaseB {}
        BaseA.prototype.foo = { a: 1 };
        BaseB.prototype.foo = { a: 1 };
        __self.assertTrue(__jymfony.equal(new BaseA(), new BaseB()));
    }

    testReturnsFalseGivenTwoClassInstancesWithDifferentProperties() {
        class BaseA {
            constructor(prop) {
                this.prop = prop;
            }
        }
        __self.assertFalse(__jymfony.equal(new BaseA(1), new BaseA(2)));
    }

    testReturnsFalseGivenTwoClassInstancesWithDeeplyUnequalBases() {
        class BaseA {}
        class BaseB {}
        BaseA.prototype.foo = { a: 1 };
        BaseB.prototype.foo = { a: 2 };
        __self.assertFalse(__jymfony.equal(new BaseA(), new BaseB()));
    }

    testReturnsTrueGivenTwoArguments() {
        const argumentsA = getArguments();
        const argumentsB = getArguments();
        __self.assertTrue(__jymfony.equal(argumentsA, argumentsB));
    }

    testReturnsTrueGivenTwoArgumentsWithSameProperties() {
        const argumentsA = getArguments(1, 2);
        const argumentsB = getArguments(1, 2);
        __self.assertTrue(__jymfony.equal(argumentsA, argumentsB));
    }

    testReturnsFalseGivenTwoArgumentsWithDifferentProperties() {
        const argumentsA = getArguments(1, 2);
        const argumentsB = getArguments(3, 4);
        __self.assertFalse(__jymfony.equal(argumentsA, argumentsB));
    }

    testReturnsFalseGivenAnArray() {
        // eslint-disable-next-line prefer-rest-params
        __self.assertFalse(__jymfony.equal([], arguments));
    }

    testReturnsFalseGivenAnObject() {
        // eslint-disable-next-line prefer-rest-params
        __self.assertFalse(__jymfony.equal({}, arguments));
    }

    testReturnsTrueWithArraysContainingSameLiterals() {
        __self.assertTrue(__jymfony.equal([ 1, 2, 3 ], [ 1, 2, 3 ]));
        __self.assertTrue(__jymfony.equal([ 'a', 'b', 'c' ], [ 'a', 'b', 'c' ]));
    }

    testReturnsTrueGivenLiteralOrConstructor() {
        __self.assertTrue(__jymfony.equal([ 1, 2, 3 ], new Array(1, 2, 3)));
    }

    testReturnsFalseWithArraysContainingLiteralsInDifferentOrder() {
        __self.assertFalse(__jymfony.equal([ 3, 2, 1 ], [ 1, 2, 3 ]));
    }

    testReturnsFalseForArraysOfDifferentLength() {
        __self.assertFalse(__jymfony.equal(new Array(1), new Array(100)));
    }

    testReturnsTrueWithObjectsContainingSameLiterals() {
        __self.assertTrue(__jymfony.equal({ foo: 1, bar: 2 }, { foo: 1, bar: 2 }));
        __self.assertTrue(__jymfony.equal({ foo: 'baz' }, { foo: 'baz' }));
    }

    testReturnsTrueForDeeplyNestedObjects() {
        __self.assertTrue(__jymfony.equal({ foo: { bar: 'foo' } }, { foo: { bar: 'foo' } }));
    }

    testReturnsTrueWithObjectsWithSameCircularReference() {
        const objectA = { foo: 1 };
        const objectB = { foo: 1 };
        const objectC = { a: objectA, b: objectB };
        objectA.bar = objectC;
        objectB.bar = objectC;
        __self.assertTrue(__jymfony.equal(objectA, objectB));
    }

    testReturnsTrueWithObjectsWithDeeplyEqualPrototypes() {
        const objectA = Object.create({ foo: { a: 1 } });
        const objectB = Object.create({ foo: { a: 1 } });
        __self.assertTrue(__jymfony.equal(objectA, objectB));
    }

    testReturnsFalseWithObjectsContainingDifferentLiterals() {
        __self.assertFalse(__jymfony.equal({ foo: 1, bar: 1 }, { foo: 1, bar: 2 }));
        __self.assertFalse(__jymfony.equal({ foo: 'bar' }, { foo: 'baz' }));
        __self.assertFalse(__jymfony.equal({ foo: { bar: 'foo' } }, { foo: { bar: 'baz' } }));
    }

    testReturnsFalseWithObjectsContainingDifferentKeys() {
        __self.assertFalse(__jymfony.equal({ foo: 1, bar: 1 }, { foo: 1, baz: 2 }));
        __self.assertFalse(__jymfony.equal({ foo: 'bar' }, { bar: 'baz' }));
    }

    testReturnsTrueWithCircularObjects() {
        const objectA = { foo: 1 };
        const objectB = { foo: 1 };
        objectA.bar = objectB;
        objectB.bar = objectA;
        __self.assertTrue(__jymfony.equal(objectA, objectB));
    }

    testReturnsTrueWithFrozenObjects() {
        const objectA = Object.freeze({ foo: 1 });
        const objectB = Object.freeze({ foo: 1 });
        __self.assertTrue(__jymfony.equal(objectA, objectB));
    }

    testReturnsFalseWithObjectsWithDeeplyUnequalPrototypes() {
        const objectA = Object.create({ foo: { a: 1 } });
        const objectB = Object.create({ foo: { a: 2 } });
        __self.assertFalse(__jymfony.equal(objectA, objectB));
    }

    testReturnsTrueForSameFunctions() {
        function foo() {}
        __self.assertTrue(__jymfony.equal(foo, foo));
    }

    testReturnsFalseForDifferentFunctions() {
        __self.assertFalse(__jymfony.equal(function foo() {}, function bar() {}));
    }

    testReturnsTrueForSameErrors() {
        const error = new Error('foo');
        __self.assertTrue(__jymfony.equal(error, error));
    }

    testReturnsFalseForDifferentErrors() {
        __self.assertFalse(__jymfony.equal(new Error('foo'), new Error('foo')));
    }

    testReturnsTrueForSameBuffers() {
        __self.assertTrue(__jymfony.equal(Buffer.from([ 1 ]), Buffer.from([ 1 ])));
    }

    testReturnsFalseForDifferentBuffers() {
        __self.assertFalse(__jymfony.equal(Buffer.from([ 1 ]), Buffer.from([ 2 ])));
    }

    testReturnsTrueForStringsWithSameEntries() {
        __self.assertTrue(__jymfony.equal('abc'[Symbol.iterator](), 'abc'[Symbol.iterator]()));
    }

    testReturnsFalseForStringsWithDifferentEntries() {
        __self.assertFalse(__jymfony.equal('abc'[Symbol.iterator](), 'def'[Symbol.iterator]()));
    }

    testReturnsTrueForArrayIteratorWithSameEntries() {
        __self.assertTrue(__jymfony.equal([ 1, 2, 3 ][Symbol.iterator](), [ 1, 2, 3 ][Symbol.iterator]()));
    }

    testReturnsFalseForArrayIteratorWithDifferentEntries() {
        __self.assertFalse(__jymfony.equal([ 1, 2, 3 ][Symbol.iterator](), [ 4, 5, 6 ][Symbol.iterator]()));
    }

    testReturnsTrueForArrayEntriesWithSameEntries() {
        __self.assertTrue(__jymfony.equal([ 1, 2, 3 ].entries(), [ 1, 2, 3 ].entries()));
    }

    testReturnsFalseForArrayEntriesWithDifferentEntries() {
        __self.assertFalse(__jymfony.equal([ 1, 2, 3 ].entries(), [ 4, 5, 6 ].entries()));
    }

    testReturnsTrueForMapsWithSameEntries() {
        const mapA = new Map();
        const mapB = new Map();
        mapA.set('a', 1);
        mapA.set('b', 2);
        mapA.set('c', 3);
        mapB.set('c', 3);
        mapB.set('b', 2);
        mapB.set('a', 1);
        __self.assertTrue(__jymfony.equal(mapA, mapB));
    }

    testReturnsFalseForMapsWithDifferentEntries() {
        const mapA = new Map();
        const mapB = new Map();
        mapA.set('a', 1);
        mapB.set('a', 2);
        mapA.set('b', 3);
        mapB.set('b', 4);
        mapA.set('c', 5);
        mapB.set('c', 6);
        __self.assertFalse(__jymfony.equal(mapA, mapB));
    }

    testReturnsTrueForMapIteratorsWithSameEntries() {
        const mapA = new Map();
        const mapB = new Map();
        mapA.set('a', 1);
        mapB.set('a', 1);
        mapA.set('b', 2);
        mapB.set('b', 2);
        mapA.set('c', 3);
        mapB.set('c', 3);
        __self.assertTrue(__jymfony.equal(mapA[Symbol.iterator](), mapB[Symbol.iterator]()));
    }

    testReturnsFalseForMapIteratorsWithDifferentEntries() {
        const mapA = new Map();
        const mapB = new Map();
        mapA.set('a', 1);
        mapB.set('a', 2);
        mapA.set('b', 3);
        mapB.set('b', 4);
        mapA.set('c', 5);
        mapB.set('c', 6);
        __self.assertFalse(__jymfony.equal(mapA[Symbol.iterator](), mapB[Symbol.iterator]()));
    }

    testReturnsTrueForMapEntriesWithSameEntries() {
        const mapA = new Map();
        const mapB = new Map();
        mapA.set('a', 1);
        mapB.set('a', 1);
        mapA.set('b', 2);
        mapB.set('b', 2);
        mapA.set('c', 3);
        mapB.set('c', 3);
        __self.assertTrue(__jymfony.equal(mapA.entries(), mapB.entries()));
    }

    testReturnsFalseForMapEntriesWithDifferentEntries() {
        const mapA = new Map();
        const mapB = new Map();
        mapA.set('a', 1);
        mapB.set('a', 2);
        mapA.set('b', 3);
        mapB.set('b', 4);
        mapA.set('c', 5);
        mapB.set('c', 6);
        __self.assertFalse(__jymfony.equal(mapA.entries(), mapB.entries()));
    }

    testReturnsTrueForSameWeakMaps() {
        const weakMap = new WeakMap();
        __self.assertTrue(__jymfony.equal(weakMap, weakMap));
    }

    testReturnsFalseForDifferentWeakMaps() {
        __self.assertFalse(__jymfony.equal(new WeakMap(), new WeakMap()));
    }

    testReturnsTrueForSetsWithSameEntries() {
        const setA = new Set();
        const setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('a');
        setB.add('b');
        setB.add('c');
        __self.assertTrue(__jymfony.equal(setA, setB));
    }

    testReturnsTrueForSetsWithSameEntriesInDifferentOrder() {
        const setA = new Set();
        const setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('b');
        setB.add('c');
        setB.add('a');
        __self.assertTrue(__jymfony.equal(setA, setB));
    }

    testReturnsTrueForSetsWithNestedEntries() {
        const setA = new Set();
        const setB = new Set();
        setA.add([ [], [], [] ]);
        setB.add([ [], [], [] ]);
        __self.assertTrue(__jymfony.equal(setA, setB));
    }

    testReturnsTrueForSetsWithSameCircularReferences() {
        const setA = new Set();
        const setB = new Set();
        const setC = new Set();
        setA.add(setC);
        setB.add(setC);
        setC.add(setA);
        setC.add(setB);
        __self.assertTrue(__jymfony.equal(setA, setB));
    }

    testReturnsFalseForSetsWithDifferentEntries() {
        const setA = new Set();
        const setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('d');
        setB.add('e');
        setB.add('f');
        __self.assertFalse(__jymfony.equal(setA, setB));
    }

    testReturnsTrueForCircularSets() {
        const setA = new Set();
        const setB = new Set();
        setA.add(setB);
        setB.add(setA);
        __self.assertTrue(__jymfony.equal(setA, setB));
    }

    testReturnsTrueForSetIteratorWithSameEntries() {
        const setA = new Set();
        const setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('c');
        setB.add('b');
        setB.add('a');
        __self.assertTrue(__jymfony.equal(setA[Symbol.iterator](), setB[Symbol.iterator]()));
    }

    testReturnsFalseForSetIteratorWithDifferentEntries() {
        const setA = new Set();
        const setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('d');
        setB.add('e');
        setB.add('f');
        __self.assertFalse(__jymfony.equal(setA[Symbol.iterator](), setB[Symbol.iterator]()));
    }

    testReturnsTrueForSetEntriesWithSameEntries() {
        const setA = new Set();
        const setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('c');
        setB.add('b');
        setB.add('a');
        __self.assertTrue(__jymfony.equal(setA.entries(), setB.entries()));
    }

    testReturnsFalseForSetEntriesWithDifferentEntries() {
        const setA = new Set();
        const setB = new Set();
        setA.add('a');
        setA.add('b');
        setA.add('c');
        setB.add('d');
        setB.add('e');
        setB.add('f');
        __self.assertFalse(__jymfony.equal(setA.entries(), setB.entries()));
    }

    testReturnsTrueForSameWeakSets() {
        const weakSet = new WeakSet();
        __self.assertTrue(__jymfony.equal(weakSet, weakSet));
    }

    testReturnsFalseForDifferentWeakSets() {
        __self.assertFalse(__jymfony.equal(new WeakSet(), new WeakSet()));
    }

    testReturnsTrueForTheSameSymbols() {
        const sym = Symbol();
        __self.assertTrue(__jymfony.equal(sym, sym));
        __self.assertTrue(__jymfony.equal(Symbol.iterator, Symbol.iterator));
    }

    testReturnsFalseForDifferentSymbols() {
        __self.assertFalse(__jymfony.equal(Symbol(), Symbol()));
    }

    testReturnsTrueForTheSamePromises() {
        const promiseResolve = Promise.resolve();
        const promiseReject = Promise.reject(new Error()).catch(() => {});
        const promisePending = new Promise(() => {});
        __self.assertTrue(__jymfony.equal(promiseResolve, promiseResolve));
        __self.assertTrue(__jymfony.equal(promiseReject, promiseReject));
        __self.assertTrue(__jymfony.equal(promisePending, promisePending));
    }


    testReturnsFalseForDifferentPromises() {
        __self.assertFalse(__jymfony.equal(Promise.resolve(), Promise.resolve()));
        __self.assertFalse(__jymfony.equal(Promise.reject(new Error()).catch(() => {}), Promise.reject(new Error()).catch(() => {})));
        __self.assertFalse(__jymfony.equal(new Promise(() => {}), new Promise(() => {})));
    }

    testReturnsTrueForInt8ArraysWithSameValues() {
        __self.assertTrue(__jymfony.equal(new Int8Array(1, 2, 3, 4), new Int8Array(1, 2, 3, 4)));
    }

    testReturnsFalseForInt8ArraysWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Int8Array(1, 2, 3, 4), new Int8Array(5, 6, 7, 8)));
        __self.assertFalse(__jymfony.equal(new Int8Array(1, 2, 3, 4), new Int8Array(4, 2, 3, 4)));
    }

    testReturnsTrueForUint8ArraysWithSameValues() {
        __self.assertTrue(__jymfony.equal(new Uint8Array(1, 2, 3, 4), new Uint8Array(1, 2, 3, 4)));
    }

    testReturnsFalseForUint8ArraysWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Uint8Array(1, 2, 3, 4), new Uint8Array(5, 6, 7, 8)));
        __self.assertFalse(__jymfony.equal(new Uint8Array(1, 2, 3, 4), new Uint8Array(4, 2, 3, 4)));
    }

    testReturnsTrueForUint8ClampedArraysWithSameValues() {
        __self.assertTrue(__jymfony.equal(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(1, 2, 3, 4)));
    }

    testReturnsFalseForUint8ClampedArraysWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(5, 6, 7, 8)));
        __self.assertFalse(__jymfony.equal(new Uint8ClampedArray(1, 2, 3, 4), new Uint8ClampedArray(4, 2, 3, 4)));
    }

    testReturnsTrueForInt16ArraysWithSameValues() {
        __self.assertTrue(__jymfony.equal(new Int16Array(1, 2, 3, 4), new Int16Array(1, 2, 3, 4)));
    }

    testReturnsFalseForInt16ArraysWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Int16Array(1, 2, 3, 4), new Int16Array(5, 6, 7, 8)));
        __self.assertFalse(__jymfony.equal(new Int16Array(1, 2, 3, 4), new Int16Array(4, 2, 3, 4)));
    }

    testReturnsTrueForUint16ArraysWithSameValues() {
        __self.assertTrue(__jymfony.equal(new Uint16Array(1, 2, 3, 4), new Uint16Array(1, 2, 3, 4)));
    }

    testReturnsFalseForUint16ArraysWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Uint16Array(1, 2, 3, 4), new Uint16Array(5, 6, 7, 8)));
        __self.assertFalse(__jymfony.equal(new Uint16Array(1, 2, 3, 4), new Uint16Array(4, 2, 3, 4)));
    }

    testReturnsTrueForInt32ArraysWithSameValues() {
        __self.assertTrue(__jymfony.equal(new Int32Array(1, 2, 3, 4), new Int32Array(1, 2, 3, 4)));
    }

    testReturnsFalseForInt32ArraysWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Int32Array(1, 2, 3, 4), new Int32Array(5, 6, 7, 8)));
        __self.assertFalse(__jymfony.equal(new Int32Array(1, 2, 3, 4), new Int32Array(4, 2, 3, 4)));
    }

    testReturnsTrueForUint32ArraysWithSameValues() {
        __self.assertTrue(__jymfony.equal(new Uint32Array(1, 2, 3, 4), new Uint32Array(1, 2, 3, 4)));
    }

    testReturnsFalseForUint32ArraysWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Uint32Array(1, 2, 3, 4), new Uint32Array(5, 6, 7, 8)));
        __self.assertFalse(__jymfony.equal(new Uint32Array(1, 2, 3, 4), new Uint32Array(4, 2, 3, 4)));
    }

    testReturnsTrueForFloat32ArraysWithSameValues() {
        __self.assertTrue(__jymfony.equal(new Float32Array(1, 2, 3, 4), new Float32Array(1, 2, 3, 4)));
    }

    testReturnsFalseForFloat32ArraysWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Float32Array(1, 2, 3, 4), new Float32Array(5, 6, 7, 8)));
        __self.assertFalse(__jymfony.equal(new Float32Array(1, 2, 3, 4), new Float32Array(4, 2, 3, 4)));
    }

    testReturnsTrueForFloat64ArraysWithSameValues() {
        __self.assertTrue(__jymfony.equal(new Float64Array(1, 2, 3, 4), new Float64Array(1, 2, 3, 4)));
    }

    testReturnsFalseForFloat64ArraysWithDifferentValues() {
        __self.assertFalse(__jymfony.equal(new Float64Array(1, 2, 3, 4), new Float64Array(5, 6, 7, 8)));
        __self.assertFalse(__jymfony.equal(new Float64Array(1, 2, 3, 4), new Float64Array(4, 2, 3, 4)));
    }

    testReturnsTrueForArrayBufferWithSameValues() {
        __self.assertTrue(__jymfony.equal(new ArrayBuffer(1), new ArrayBuffer(1)));
    }

    testReturnsFalseForArrayBufferWithDifferentLengths() {
        __self.assertFalse(__jymfony.equal(new ArrayBuffer(1), new ArrayBuffer(4)));
    }

    testReturnsTrueForSameArrowFunctions() {
        const arrow = () => {};
        __self.assertTrue(__jymfony.equal(arrow, arrow));
    }

    testReturnsFalseForDifferentArrowFunctions() {
        __self.assertFalse(__jymfony.equal(() => {}, () => {}));
    }

    testReturnsTrueForSameGeneratorFunctions() {
        const generator = function * generator() {};
        __self.assertTrue(__jymfony.equal(generator, generator));
    }

    testReturnsFalseForDifferentGeneratorFunctions() {
        __self.assertFalse(__jymfony.equal(function * () {}, function * () {}));
    }

    testReturnsTrueForSameGeneratorFunctionCalls() {
        const generator = function * () {
            yield 1; yield 2;
        };
        __self.assertTrue(__jymfony.equal(generator(), generator()));
    }

    testReturnsTrueForDifferentGeneratorFunctionCallsThatReturnSameResults() {
        const generatorA = function * () {
            yield 1; yield 2;
        };
        const generatorB = function * () {
            yield 1; yield 2;
        };
        __self.assertTrue(__jymfony.equal(generatorA(), generatorB()));
    }

    testReturnsTrueForDifferentGeneratorFunctionCallsAreAtLevelOfIterationWithSameResults() {
        const generatorA = function * () {
            yield 1; yield 2; yield 3;
        };
        const generatorB = function * () {
            yield 6; yield 2; yield 3;
        };
        const generatorAIterator = generatorA();
        const generatorBIterator = generatorB();
        generatorAIterator.next();
        generatorBIterator.next();
        __self.assertTrue(__jymfony.equal(generatorAIterator, generatorBIterator));
    }

    testReturnsFalseForSameGeneratorFunctionCallsThatReturnDifferentResults() {
        let set = 0;
        const generator = function * () {
            yield set++;
        };
        __self.assertFalse(__jymfony.equal(generator(), generator()));
    }

    testReturnsFalseForGeneratorsAtDifferentStagesOfIteration() {
        const generatorA = function * () {
            yield 1; yield 2;
        };
        const generatorB = function * () {
            yield 1; yield 2;
        };
        const generatorBIterator = generatorB();
        generatorBIterator.next();
        __self.assertFalse(__jymfony.equal(generatorA(), generatorBIterator));
    }

    testReturnsFalseForGeneratorsIfOneIsDone() {
        const generatorA = function * () {
            yield 1; yield 2;
        };
        const generatorB = function * () {
            yield 1; yield 2;
        };
        const generatorBIterator = generatorB();
        generatorBIterator.next();
        generatorBIterator.next();
        generatorBIterator.next();
        __self.assertFalse(__jymfony.equal(generatorA(), generatorBIterator));
    }
}
