const Type = Jymfony.Component.Autoloader.Decorator.Type;

export default class FooClass {
    /**
     * Constructor.
     */
    constructor(@Type('string') param) {
    }
}
