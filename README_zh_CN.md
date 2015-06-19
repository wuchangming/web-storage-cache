# WebStorageCache [Draft]

  WebStorageCache 基于接口 [Storage API](http://www.w3.org/TR/webstorage/#storage).

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
  
  // 清除客户端中所有缓存
  wsCache.clear();
  
  // 为已存在的（未超时的）缓存值设置新的超时时间。
  wsCache.touch('username',  {exp : 1000});
  
  // 如果缓存中没有key为username2的缓存，则添加username2。反之什么都不做
  wsCache.add('username2', 'wqteam', 1000);
  
  // 如果缓存中有key为username的缓存，则替换为新值。反之什么都不做
  wsCache.replace('username', 'new wqteam', {exp : 1000});
  
```
# API

## Constructor
```javascript
var wsCache = new WebStorageCache({
  storage: 'localStorage', //[option] default 'localStorage'.
  serializer: serializer, //[option] defalut `serialize` uses JSON.stringify under the hood, 
                          // and 'deserialize' uses JSON.parse under the hood.
  exp: Infinity, //[option] //An expiration time, in seconds. default never .
  quotaExceedHandler: quotaExceedHandler //[option] handler quotaExceed Error. default do noting.
}); 
```


