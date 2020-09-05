export default class Reference {
    value;
    #privateValue;

    set privateValue(privateValue) {
        this.#privateValue = privateValue;
    }

    get privateValue() {
        return this.#privateValue;
    }
}
