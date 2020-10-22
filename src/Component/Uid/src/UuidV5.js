const Uuid = Jymfony.Component.Uid.Uuid;

/**
 * A v5 UUID contains a SHA1 hash of another UUID and a name.
 *
 * Use Uuid::v5() to compute one.
 *
 * @memberOf Jymfony.Component.Uid
 */
export default class UuidV5 extends Uuid {
}

Object.defineProperty(UuidV5, 'TYPE', { writable: false, configurable: false, enumerable: true, value: 5 });
