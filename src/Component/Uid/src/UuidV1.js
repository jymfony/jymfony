import { uuid_create, uuid_mac } from './functions/uuid';

const BinaryUtil = Jymfony.Component.Uid.BinaryUtil;
const Uuid = Jymfony.Component.Uid.Uuid;

/**
 * @memberOf Jymfony.Component.Uid
 */
export default class UuidV1 extends Uuid {
    __construct(uuid = null) {
        if (null === uuid) {
            this._uid = uuid_create(__self.TYPE);
        } else {
            super.__construct(uuid);
        }
    }

    getTime() {
        const time = '0' + this._uid.substring(15, 18) + this._uid.substring(9, 13) + this._uid.substring(0, 8);

        return BinaryUtil.timeToFloat(time);
    }

    getNode() {
        return uuid_mac(this._uid);
    }
}

Object.defineProperty(UuidV1, 'TYPE', { writable: false, configurable: false, enumerable: true, value: 1 });
