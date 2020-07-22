const FooBar = Foo.ts.FooBar;

export default class Bar {
    private _foo: typeof FooBar;

    constructor() {
        this._foo = new FooBar('testtest');
    }
}
