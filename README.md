# WebStorageCache  
[![Build Status](https://travis-ci.org/wuchangming/web-storage-cache.svg?branch=master)](https://travis-ci.org/wuchangming/web-storage-cache)
[![npm](https://img.shields.io/npm/dt/web-storage-cache.svg)](https://www.npmjs.com/package/web-storage-cache)
<a href='https://gitter.im/wuchangming/web-storage-cache'>
<img src='https://badges.gitter.im/Join%20Chat.svg' alt='Gitter Chat' />
</a>

### Language
 see [English Document](https://github.com/wuchangming/web-storage-cache/blob/master/README_en.md)

`WebStorageCache` 对HTML5 `localStorage` `和sessionStorage` 进行了扩展，添加了超时时间，序列化方法。可以直接存储json对象，同时可以非常简单的进行超时时间的设置。  
<b>优化</b>：`WebStorageCache`自动清除访问的过期数据，避免了过期数据的累积。另外也提供了清除全部过期数据的方法：`wsCache.deleteAllExpires();`

# 用法

[下载](https://github.com/wuchangming/web-storage-cache/releases) 最新 WebStorageCache。

npm下载
```
npm install web-storage-cache --save-dev
```

使用WebStorageCache，只要在页面上引入下面代码即可。
```html
<script src="src/web-storage-cache.js"></script>
<script>
// create WebStorageCache instance.
var wsCache = new WebStorageCache();
// cache 'wqteam' at 'username', expired in 100 seconds
wsCache.set('username', 'wqteam', {exp : 100});
</script>
```
也可以在RequireJS使用WebStorageCache：
```javascript
define(['web-storage-cache'], function(WebStorageCache) {
    // 初始化 WebStorageCache 实例.
    var wsCache = new WebStorageCache();
    // 缓存字符串'wqteam' 到 'username' 中, 超时时间100秒.
    wsCache.set('username', 'wqteam', {exp : 100});
});
```

## 例子
```javascript
var wsCache = new WebStorageCache();

// 缓存字符串'wqteam' 到 'username' 中, 超时时间100秒
wsCache.set('username', 'wqteam', {exp : 100});

// 超时截止日期，可用使用Date类型
var nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);
wsCache.set('username', 'wqteam', {exp : nextYear});

// 获取缓存中 'username' 的值
wsCache.get('username');

// 缓存简单js对象，默认使用序列化方法为JSON.stringify。可以通过初始化wsCache的时候配置serializer.serialize
wsCache.set('user', { name: 'Wu', organization: 'wqteam'});

// 读取缓存中的简单js对象 - 默认使用反序列化方法为JSON.parse。可以通过初始化wsCache的时候配置serializer.deserialize
var user = wsCache.get('user');
alert(user.name + ' belongs to ' + user.organization);

// 删除缓存中 'username'
wsCache.delete('username');

// 手工删除所有超时CacheItem,
wsCache.deleteAllExpires();

// 清除客户端中所有缓存
wsCache.clear();

// 为已存在的（未超时的）缓存值设置新的超时时间。
wsCache.touch('username', 1);

// 如果缓存中没有key为username2的缓存，则添加username2。反之什么都不做
wsCache.add('username2', 'wqteam', {exp : 1});

// 如果缓存中有key为username的缓存，则替换为新值。反之什么都不做
wsCache.replace('username', 'new wqteam', {exp : 1});

// 检查当前选择作为缓存的storage是否被用户浏览器支持。
//如果不支持调用WebStorageCache API提供的方法将什么都不做。
wsCache.isSupported();

```
# API

## Constructor
```javascript
var wsCache = new WebStorageCache({
    // [可选] 'localStorage', 'sessionStorage', window.localStorage, window.sessionStorage
    //        或者其他实现了 [Storage API] 的storage实例.
    //        默认 'localStorage'.
    storage: 'localStorage',
    // [可选]  类型Number，公共超时事件设置。默认无限大
    exp: Infinity
});
```
## isSupported
检查当前选择作为缓存的storage是否被用户浏览器支持。
如果不支持调用WebStorageCache API提供的方法将什么都不做。
```javascript
wsCache.isSupported(); // 返回值Boolean。
```
## set
往缓存中插入数据。
```javascript
// key [必填] 必须要为String类型。
// value [必填] 支持所以可以JSON.parse 的类型。注：当为undefined的时候会执行 delete(key)操作。
// options [选填] js对象，包含两个属性 exp 和 force。
// {
//     // 类型Number。超时时间，秒。默认无限大。
//     exp: 100,
//     // 类型Boolean。为true时：当超过最大容量导致无法继续插入数据操作时，先清空缓存中已超时的
//     // 内容后再尝试插入数据操作。默认为true。
//     force: true
// }
wsCache.set(key, value, options);
```
## get
根据key获取缓存中未超时数据。返回相应类型String、Boolean、PlainObject、Array的值。
```javascript
// key [必填] String类型。如果发现该key对应的值已过期,会进行delete(key)操作，返回null。
wsCache.get(key);
```
## delete
根据key删除缓存中的值。
```javascript
wsCache.delete(key);
```
## deleteAllExpires
删除缓存中所有通过WebStorageCache存储的超时值。
```javascript
wsCache.deleteAllExpires();
```
## clear
清空缓存中全部的值。注意：这个方法会清除不是使用WebStorageCache插入的值。推荐使用:`deleteAllExpires`。
```javascript
wsCache.clear();
```
## touch
根据key为已存在的（未超时的）缓存值以当前时间为基准设置新的超时时间。
```javascript
// key [必填] String类型
// exp [必填] number 单位：秒 js对象包含exp属性（以当前时间为起点的新的超时时间）
wsCache.touch(key, exp: 1);
```
## add
根据key做插入操作，如果key对应的值不存在或者已超时则插入该值，反之什么都不做。
注：不是通过WebStorageCache插入的值也会当作失效的值，依然执行`add`操作
```javascript
wsCache.add(key, value, options);
```
## replace
根据key做插入操作，如果key对应的值存在并且未超时则插入该值，反之什么都不做  
注：超时时间以当前时间为基准重新设置。
```javascript
wsCache.replace(key, value, options);
```
