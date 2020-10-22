const Uuid = Jymfony.Component.Uid.Uuid;

/**
 * A v3 UUID contains an MD5 hash of another UUID and a name.
 *
 * Use Uuid::v3() to compute one.
 *
 * @memberOf Jymfony.Component.Uid
 */
export default class UuidV3 extends Uuid {
}

Object.defineProperty(UuidV3, 'TYPE', { writable: false, configurable: false, enumerable: true, value: 3 });
