# WebStorageCache [Draft]

   <a href='https://gitter.im/WQTeam/web-storage-cache'>
    <img src='https://badges.gitter.im/Join%20Chat.svg' alt='Gitter Chat' />
  </a>

  WebStorageCache 基于接口 [storage interface](http://www.w3.org/TR/webstorage/#storage)。 对storage进行了封装，添加了超时时间，序列化方法。客户端浏览器可以像cookie一样使用。用'localStorage'或者'sessionStorage'进行数据缓存。

# 实例
```javascript
  var wsCache = new WebStorageCache();
  
  // 缓存字符串'wqteam' 到 'username' 中, 超时时间100秒
  wsCache.set('username', 'wqteam', {exp : 100});
  
  // 超时截止日期 2015 5 18
  wsCache.set('username', 'wqteam', {exp : new Date('2015 5 18')});
  
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
  wsCache.deleteAllExpireCacheItems();
  
  // 清除客户端中所有缓存
  wsCache.clear();
  
  // 为已存在的（未超时的）缓存值设置新的超时时间。
  wsCache.touch('username',  {exp : 1000});
  
  // 如果缓存中没有key为username2的缓存，则添加username2。反之什么都不做
  wsCache.add('username2', 'wqteam', 1000);
  
  // 如果缓存中有key为username的缓存，则替换为新值。反之什么都不做
  wsCache.replace('username', 'new wqteam', {exp : 1000});
  
  // 检查当前选择作为缓存的storage是否被用户浏览器支持。如果不支持调用WebStorageCache API提供的方法将什么都不做。
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
  // [可选] 默认的 序列化器 
  //        序列化方法使用 JSON.stringify, 
  //        反序列化方法使用 JSON.parse under.
  serializer: serializer, 
  //[可选]  公共超时事件设置。默认无限大
  exp: Infinity,
  //[可选]  设置处理容量溢出异常Handler。默认会遍历全部key，删除超时的项，再执行一遍set方法。
  quotaExceedHandler: quotaExceedHandler 
}); 
```


