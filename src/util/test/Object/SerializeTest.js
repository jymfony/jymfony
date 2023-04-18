const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class SerializeTest extends TestCase {
    testShouldSerializeUndefined() {
        __self.assertEquals('U', __jymfony.serialize(undefined));
    }

    testShouldSerializeNull() {
        __self.assertEquals('N', __jymfony.serialize(null));
    }

    testShouldSerializeBooleans() {
        __self.assertEquals('B:1', __jymfony.serialize(true));
        __self.assertEquals('B:0', __jymfony.serialize(false));
    }

    testShouldSerializeNumbers() {
        __self.assertEquals('D(1):0', __jymfony.serialize(0));
        __self.assertEquals('D(2):42', __jymfony.serialize(42));
        __self.assertEquals('D(4):47.3', __jymfony.serialize(47.3));
    }

    testShouldSerializeStrings() {
        __self.assertEquals('S(2):""', __jymfony.serialize(''));
        __self.assertEquals('S(13):"hello world"', __jymfony.serialize('hello world'));
    }

    testShouldSerializeArrays() {
        __self.assertEquals('A(6):{0:D(1):1;1:D(3):1.1;2:S(7):"hallo";3:N;4:B:1;5:A(0):{};}', __jymfony.serialize([ 1, 1.1, 'hallo', null, true, [] ]));
    }

    testShouldSerializeBuffer() {
        __self.assertEquals('X(8):54455354', __jymfony.serialize(Buffer.from('TEST')));
    }

    testShouldSerializeObjectLiterals() {
        __self.assertEquals('O(6):{S(3):"a":D(1):1;S(3):"b":D(3):1.1;S(3):"c":S(7):"hallo";S(3):"d":N;S(3):"e":B:1;S(3):"f":A(0):{};}', __jymfony.serialize({a: 1, b: 1.1, c: 'hallo', d: null, e: true, f: []}));
    }

    testShouldSerializeObjects() {
        __self.assertEquals('C[Jymfony.Util.Fixtures.BarClass]:{S(7):"hello":S(7):"world";}', __jymfony.serialize(new Jymfony.Util.Fixtures.BarClass()));

        const foo = new Jymfony.Util.Fixtures.FooClass();
        __self.assertEquals('C[Jymfony.Util.Fixtures.FooClass]:{S(3):"a":S(7):"hello";S(3):"c":S(7):"world";}', __jymfony.serialize(foo));
        __self.assertTrue(foo.sleepCalled);
    }

    testShouldSerializeHashtables() {
        __self.assertEquals('T[HashTable](3):{A(2):{0:S(6):"test";1:D(3):123;};A(2):{0:S(5):"foo";1:S(5):"bar";};A(2):{0:S(5):"bar";1:S(8):"barbar";};}', __jymfony.serialize(HashTable.fromObject({ test: 123, foo: 'bar', bar: 'barbar' })));
    }

    testShouldSerializePriorityQueues() {
        const queue = new PriorityQueue();
        queue.push('foo', 100);
        queue.push('bar', -3);
        queue.push('foobar', 300);

        __self.assertEquals('T[PriorityQueue](3):{A(2):{0:D(3):300;1:S(8):"foobar";};A(2):{0:D(3):100;1:S(5):"foo";};A(2):{0:D(2):-3;1:S(5):"bar";};}', __jymfony.serialize(queue));
    }

    testShouldSerializeLinkedLists() {
        const list = new LinkedList();

        list.push('foo');
        list.push({ bar: 'bar' });
        list.push(123);

        __self.assertEquals('T[LinkedList](3):{S(5):"foo";O(1):{S(5):"bar":S(5):"bar";};D(3):123;}', __jymfony.serialize(list));
    }

    testShouldSerializeBtrees() {
        const tree = new BTree();

        tree.push('a', 'foo');
        tree.push('b', { bar: 'bar' });
        tree.push('c', 123);
        tree.push(12, 123456);

        __self.assertEquals('T[BTree](4):{A(2):{0:D(2):12;1:D(6):123456;};A(2):{0:S(3):"a";1:S(5):"foo";};A(2):{0:S(3):"b";1:O(1):{S(5):"bar":S(5):"bar";};};A(2):{0:S(3):"c";1:D(3):123;};}', __jymfony.serialize(tree));
    }

    testShouldUnserializeUndefined() {
        __self.assertUndefined(__jymfony.unserialize('U'));
    }

    testShouldUnserializeNull() {
        __self.assertNull(__jymfony.unserialize('N'));
    }

    testShouldUnserializeBooleans() {
        __self.assertTrue(__jymfony.unserialize('B:1'));
        __self.assertFalse(__jymfony.unserialize('B:0'));
    }

    testShouldUnserializeNumbers() {
        __self.assertEquals(0, __jymfony.unserialize('D(1):0'));
        __self.assertEquals(42, __jymfony.unserialize('D(2):42'));
        __self.assertEquals(47.3, __jymfony.unserialize('D(4):47.3'));
    }

    testShouldUnserializeStrings() {
        __self.assertEquals('', __jymfony.unserialize('S(2):""'));
        __self.assertEquals('hello world', __jymfony.unserialize('S(13):"hello world"'));
    }

    testShouldUnserializeArrays() {
        __self.assertEquals([ 1, 1.1, 'hallo', null, true, [] ], __jymfony.unserialize('A(6):{0:D(1):1;1:D(3):1.1;2:S(7):"hallo";3:N;4:B:1;5:A(0):{};}'));
    }

    testShouldUnserializeBuffer() {
        __self.assertEquals(Buffer.from('TEST'), __jymfony.unserialize('X(8):54455354'));
    }

    testShouldUnserializeObjectLiterals() {
        __self.assertEquals({a: 1, b: 1.1, c: 'hallo', d: null, e: true, f: []}, __jymfony.unserialize('O(6):{S(3):"a":D(1):1;S(3):"b":D(3):1.1;S(3):"c":S(7):"hallo";S(3):"d":N;S(3):"e":B:1;S(3):"f":A(0):{};}'));
    }

    testShouldUnserializeObjects() {
        const obj = __jymfony.unserialize('C[Jymfony.Util.Fixtures.BarClass]:{S(7):"hello":S(7):"world";}');
        __self.assertInstanceOf(Jymfony.Util.Fixtures.BarClass, obj);
        __self.assertEquals('world', obj.hello);

        const foo = __jymfony.unserialize('C[Jymfony.Util.Fixtures.FooClass]:{S(3):"a":S(7):"hello";S(3):"c":S(7):"world";}');
        __self.assertInstanceOf(Jymfony.Util.Fixtures.FooClass, foo);
        __self.assertEquals('hello', foo.a);
        __self.assertUndefined(foo.b);
        __self.assertEquals('world', foo.c);
        __self.assertUndefined(foo.d);
        __self.assertTrue(foo.wakeupCalled);
    }

    testShouldNotUnserializeObjectsWhenAllowedClassesIsFalse() {
        const obj = __jymfony.unserialize('C[Jymfony.Util.Fixtures.BarClass]:{S(7):"hello":S(7):"world";}', { allowedClasses: false });
        __self.assertEquals('__Incomplete_Class', obj.constructor.name);
        __self.assertEquals('Jymfony.Util.Fixtures.BarClass', obj.__Class_Name);
        __self.assertEquals('world', obj.hello);

        const foo = __jymfony.unserialize('C[Jymfony.Util.Fixtures.FooClass]:{S(3):"a":S(7):"hello";S(3):"c":S(7):"world";}', { allowedClasses: [ 'Jymfony.FooBar' ] });
        __self.assertEquals('__Incomplete_Class', foo.constructor.name);
        __self.assertEquals('Jymfony.Util.Fixtures.FooClass', foo.__Class_Name);
        __self.assertEquals('hello', foo.a);
        __self.assertEquals('world', foo.c);
    }

    testShouldUnserializeHashTables() {
        const obj = __jymfony.unserialize('T[HashTable](3):{A(2):{0:S(6):"test";1:D(3):123;};A(2):{0:S(5):"foo";1:S(5):"bar";};A(2):{0:S(5):"bar";1:S(8):"barbar";};}');
        __self.assertEquals(HashTable, obj.constructor);
        __self.assertEquals({
            test: 123,
            'foo': 'bar',
            'bar': 'barbar',
        }, obj.toObject());
    }

    testShouldUnserializePriorityQueues() {
        const obj = __jymfony.unserialize('T[PriorityQueue](3):{A(2):{0:D(3):300;1:S(8):"foobar";};A(2):{0:D(3):100;1:S(5):"foo";};A(2):{0:D(2):-3;1:S(5):"bar";};}');
        __self.assertEquals(PriorityQueue, obj.constructor);

        const queue = new PriorityQueue();
        queue.push('foobar', 300);
        queue.push('foo', 100);
        queue.push('bar', -3);

        __self.assertEquals(queue, obj);
    }

    testShouldUnserializeLinkedLists() {
        const obj = __jymfony.unserialize('T[LinkedList](3):{S(5):"foo";O(1):{S(5):"bar":S(5):"bar";};D(3):123;}');
        __self.assertEquals(LinkedList, obj.constructor);

        const list = new LinkedList();

        list.push('foo');
        list.push({ bar: 'bar' });
        list.push(123);

        __self.assertEquals(list, obj);
    }

    testShouldUnserializeBtrees() {
        const obj = __jymfony.unserialize('T[BTree](4):{A(2):{0:D(2):12;1:D(6):123456;};A(2):{0:S(3):"a";1:S(5):"foo";};A(2):{0:S(3):"b";1:O(1):{S(5):"bar":S(5):"bar";};};A(2):{0:S(3):"c";1:D(3):123;};}');
        __self.assertEquals(BTree, obj.constructor);

        const tree = new BTree();
        tree.push(12, 123456);
        tree.push('a', 'foo');
        tree.push('b', { bar: 'bar' });
        tree.push('c', 123);

        __self.assertEquals(tree, obj);
    }
}
