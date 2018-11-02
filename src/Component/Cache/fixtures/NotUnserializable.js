/**
 * @memberOf Jymfony.Component.Cache.Fixtures
 */
class NotUnserializable {
    /**
     * Wakeup from de-serialization.
     */
    __wakeup() {
        throw new Exception('Not unserializable');
    }
}

module.exports = NotUnserializable;
