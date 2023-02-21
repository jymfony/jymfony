/// <reference path="../../index.d.ts" />

import CacheInterface = Jymfony.Contracts.Cache.CacheInterface;
import CacheItemPoolInterface = Jymfony.Contracts.Cache.CacheItemPoolInterface;
import CacheItemInterface = Jymfony.Contracts.Cache.CacheItemInterface;
import CacheTrait = Jymfony.Contracts.Cache.CacheTrait;
import ValueHolder = Jymfony.Contracts.Cache.ValueHolder;

class ItemPool extends implementationOf(CacheItemPoolInterface) implements CacheItemPoolInterface {
    getItem(key: string): Promise<CacheItemInterface<any>> {
        throw new Error("Method not implemented.");
    }
    getItems(keys?: string[]): Promise<Map<string, CacheItemInterface<any>>> {
        throw new Error("Method not implemented.");
    }
    hasItem(key: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    clear(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    deleteItem(key: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    deleteItems(keys: string[]): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    save(item: CacheItemInterface<any>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    close(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

class TestCache extends implementationOf(CacheInterface, CacheTrait) {
    _doGet(pool: CacheItemPoolInterface, key: string, callback: (item: CacheItemPoolInterface, save: ValueHolder<boolean>) => any, beta?: null | number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
