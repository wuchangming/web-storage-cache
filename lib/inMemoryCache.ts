/*
 * WebStorageCache - 1.1.1
 * https://github.com/WQTeam/web-storage-cache
 *
 * This is free and unencumbered software released into the public domain.
 */
export const maxExpire: Date = new Date('Fri, 31 Dec 9999 23:59:59 UTC')
export let defaultExpire: number | Date = maxExpire

export function isValidDate(date: any): boolean {
    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())
}

export function getExpiresDate(expires: number | string | Date, now: Date = new Date()) {
    let newExpires: Date
    if (typeof expires === 'number') {
        newExpires = expires === Infinity ? maxExpire : new Date(now.getTime() + expires * 1000)
    } else if (typeof expires === 'string') {
        newExpires = new Date(expires)
    }
    if (expires && !isValidDate(expires)) {
        throw new Error('`expires` parameter cannot be converted to a valid Date instance')
    }
    return newExpires
}

export class MemoryCacheItem<T> {
    public currentTime: number
    public expires: number
    public value: T
    constructor(value: T, expires: number | Date = defaultExpire) {
        this.currentTime = new Date().getTime()
        this.expires = getExpiresDate(expires).getTime()
        this.value = value
    }

    checkIfEffective(): boolean {
        return new Date().getTime() < this.expires
    }
}

export interface WebStorageCacheOptions {
    expires: number
    overflow: boolean
}

export class ObjectMemoryCache<O, R> {
    private map: Map<O, MemoryCacheItem<R>>
    private maxSize: number
    constructor(expires: number = Infinity, max: number = 1000) {
        if (expires && typeof expires !== 'number' && !isValidDate(expires)) {
            throw new Error(
                'Constructor `exp` parameter cannot be converted to a valid Date instance',
            )
        } else {
            defaultExpire = expires
        }
        this.map = new Map()
        this.maxSize = max
    }

    private checkMaxSize(): boolean {
        if (this.maxSize >= this.map.size) {
            return false
        }
        return true
    }

    public set(key: O, value: R, expires: number): R {
        if (!this.checkMaxSize()) {
        }
        const cacheItem: MemoryCacheItem<R> = new MemoryCacheItem<R>(value, expires)
        this.map.set(key, cacheItem)
        return value
    }

    public get(key: O): R | void {
        const cacheItem: MemoryCacheItem<R> = this.map.get(key)
        if (cacheItem.checkIfEffective()) {
            return cacheItem.value
        } else {
            this.delete(key)
        }
    }

    public delete(key: O): boolean {
        return this.map.delete(key)
    }

    public deleteAllExpires(): void {
        const size: number = this.map.size
        const keys: IterableIterator<O> = this.map.keys()
        for (let i = 0; i < size; i++) {
            const key: O = keys.next().value
            const cacheItem: MemoryCacheItem<R> | void = this.map.get(key)
            if (cacheItem) {
                if (!cacheItem.checkIfEffective()) {
                    this.delete(key)
                }
            }
        }
    }

    public clear(): void {
        this.map.clear()
    }

    // 如果key对应的值不存在或者已超时则插入该值
    public add(key: O, value: R, expires: number): boolean {
        const cacheItem: MemoryCacheItem<R> = this.map.get(key)
        if (!cacheItem.checkIfEffective()) {
            this.set(key, value, expires)
            return true
        }
        return false
    }

    // 如果key对应的值存在并且未超时则插入该值
    public replace(key: O, value: R, expires: number): boolean {
        var cacheItem: MemoryCacheItem<R> = this.map.get(key)
        if (cacheItem.checkIfEffective()) {
            this.set(key, value, expires)
            return true
        } else {
            this.delete(key)
        }
        return false
    }

    // 根据key为已存在的（未超时的）缓存值以当前时间为基准设置新的超时时间
    public touch(key: O, expires: number): boolean {
        const value: R | void = this.get(key)
        if (value) {
            this.set(key, value, expires)
            return true
        }
        return false
    }
}
