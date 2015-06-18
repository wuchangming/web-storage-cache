# WebStorageCache [Draft]

  WebStorageCache designed according to [Storage API](http://www.w3.org/TR/webstorage/#storage).

# Usage
```javascript
  var wsCache = new WebStorageCache();
  
  // cache 'wqteam' at 'username', expired in 100 seconds
  wsCache.set('username', 'wqteam', {exp : 100});
  
  // deadline in  May 18 2015
  wsCache.set('username', 'wqteam', {exp : new Date('2015 5 18')});
  
  // get 'username' 
  wsCache.get('username');
  
  // cache an object literal - default uses JSON.stringify under the hood
  wsCache.set('user', { name: 'Wu', organization: 'wqteam'});
  
  // Get the cache object - default uses JSON.parse under the hood
  var user = wsCache.get('user');
  alert(user.name + ' belongs to ' + user.organization);
  
  // delete 'username'
  wsCache.delete('username');
  
  // Clear all keys
  wsCache.clear();
  
  // Set a new expiration time for an existing key.
  wsCache.touch('username',  {exp : 1000});
  
  // Add key-value item to cache, success only when the key is not exists in cache
  wsCache.add('username2', 'wqteam', 1000);
  
  // Replace the key's data item in cache, success only when the key's data item is exists in cache.
  wsCache.replace('username', 'new wqteam', {exp : 1000});
  
```
# API

## Constructor
```javascript
var wsCache = new WebStorageCache({
  storage: 'localStorage', //[option] default 'localStorage'.
  serializer: serializer, //[option] defalut `serialize` uses JSON.stringify under the hood, 
                          // and 'deserialize' uses JSON.parse under the hood.
  exp: Infinity //[option] //An expiration time, in seconds. default never .
}); 
```


