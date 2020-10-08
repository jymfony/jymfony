export default class EntityWithGroupedConstraintOnMethods {
    bar;

    isValidInFoo() {
        return false;
    }

    getBar() {
        throw new Exception('Should not be called');
    }
}
