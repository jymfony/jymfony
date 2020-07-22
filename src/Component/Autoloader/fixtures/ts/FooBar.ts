export default class FooBar {
    private readonly _aNode: string;

    constructor(value: string) {
        this._aNode = value;
    }

    get node(): string {
        return this._aNode;
    }
}
