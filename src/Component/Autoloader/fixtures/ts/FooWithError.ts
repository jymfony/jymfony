export default class FooWithError {
    private readonly _aNode: string;

    constructor(value: number) {
        this._aNode = value;
    }

    get node(): number {
        return this._aNode;
    }
}
