# WebStorageCache

  WebStorageCache designed according to [Storage API](http://www.w3.org/TR/webstorage/#storage).

# usage
```javascript
  var wsCache = new WebStorageCache();
  
  // cache 'wqteam' at 'username', expired in 100 seconds
  wsCache.set('username', 'wqteam', 100);
  
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
  wsCache.touch('username', 1000);
  
  // Add key-value item to cache, success only when the key is not exists in cache
  wsCache.add('username2', 'wqteam', 1000);
  
  // Replace the key's data item in cache, success only when the key's data item is exists in cache.
  wsCache.replace('username', 'new wqteam', 1000);
  
```


