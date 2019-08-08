// Const { expect } = require('chai');
// Const { join } = require('path');
// Const fs = require('fs');
//
// /*
//  * We are testing autoloader component here
//  * Cannot use the autoloader itself to load classes! :)
//  */
// Const Autoloader = require('../../src/Autoloader');
// Const Namespace = require('../../src/Namespace');
//
// Describe('[Autoloader] Annotations transpiler', () => {
//     AfterEach(() => {
//         Delete global.Foo;
//     });
//
//     It('should transpile annotations', () => {
//         Global.Foo = new Namespace(__jymfony.autoload, 'Foo', join(__dirname, '..', '..', 'fixtures'), require);
//         Const a = new Foo.Annotated();
//         Const r = new ReflectionClass(a);
//
//         // dd(r.annotations);
//
//         // dd(Foo.Annotated[Symbol.annotations], new ReflectionClass(a));
//     });
// });
