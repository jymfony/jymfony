import { UUID_TYPE_NULL } from './functions/uuid';

const Uuid = Jymfony.Component.Uid.Uuid;

/**
 * @memberOf Jymfony.Component.Uid
 */
export default class NilUuid extends Uuid {
    __construct() {
        this._uid = '00000000-0000-0000-0000-000000000000';
    }
}

Object.defineProperty(NilUuid, 'TYPE', { writable: false, configurable: false, enumerable: true, value: UUID_TYPE_NULL });
