declare module 'web-storage-cache' {
  class WebStorageCache {
    /**
     * WebStorageCache 对 HTML5 `localStorage` 和 `sessionStorage` 进行了扩展，添加了超时时间，序列化方法。可以直接存储 json 对象，同时可以非常简单的进行超时时间的设置。
     * **优化**：WebStorageCache 自动清除访问的过期数据，避免了过期数据的累积。另外也提供了清除全部过期数据的方法：`wsCache.deleteAllExpires()`
     */
    constructor(options?: Partial<WebStorageCacheConstructorOptions>)

    /**
     * 检查当前选择作为缓存的storage是否被用户浏览器支持。 如果不支持调用WebStorageCache API提供的方法将什么都不做。
     */
    static isSupported(): boolean

    /**
     * 往缓存中插入数据。
     * @param key
     * @param value 支持所以可以JSON.parse 的类型。注：当为undefined的时候会执行 delete(key)操作。
     * @param options
     */
    set(key: string, value: any, options?: Partial<WebStorageCacheOptions>): void

    /**
     * 根据key获取缓存中未超时数据。返回相应类型String、Boolean、PlainObject、Array的值。
     */
    get(key: string): any

    /**
     * 根据key删除缓存中的值
     */
    delete(key: string): void

    /**
     * 删除缓存中所有通过WebStorageCache存储的超时值
     */
    deleteAllExpires(): void

    /**
     * 清空缓存中全部的值
     * 注意：这个方法会清除不是使用WebStorageCache插入的值。推荐使用:deleteAllExpires
     */
    clear(): void

    /**
     * 根据key为已存在的（未超时的）缓存值以当前时间为基准设置新的超时时间。
     * @param key
     * @param exp 单位：秒 js对象包含exp属性（以当前时间为起点的新的超时时间）
     */
    touch(key: string, exp: number): void

    /**
     * 根据key做插入操作，如果key对应的值不存在或者已超时则插入该值，反之什么都不做。
     * 注：不是通过WebStorageCache插入的值也会当作失效的值，依然执行add操作
     *
     * @param key
     * @param value
     * @param options
     */
    add(key: string, value: any, options?: Partial<WebStorageCacheOptions>): void

    /**
     * 根据key做插入操作，如果key对应的值存在并且未超时则插入该值，反之什么都不做
     * 注：超时时间以当前时间为基准重新设置
     *
     * @param key
     * @param value
     * @param options
     */
    replace(key: string, value: any, options?: Partial<WebStorageCacheOptions>): void
  }

  interface WebStorageCacheOptions {
    /**
     * 超时时间，秒。
     * 默认无限大。
     */
    exp: number

    /**
     * 为true时：当超过最大容量导致无法继续插入数据操作时，先清空缓存中已超时的内容后再尝试插入数据操作。
     * 默认为true。
     */
    force: boolean
  }

  interface WebStorageCacheConstructorOptions {
    /**
     * 'localStorage', 'sessionStorage', window.localStorage, window.sessionStorage 或者其他实现了 [Storage API] 的storage实例
     * 默认 'localStorage'
     */
    storage: 'localStorage' | 'sessionStorage' | Storage
    /**
     * 公共超时事件设置 默认无限大
     */
    exp: number
  }

  export = WebStorageCache
}
