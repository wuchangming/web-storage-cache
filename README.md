# webStorageCache

# usage
```javascript
  var wsCache = new WebStorageCache();
  
  // cache 'wqteam' at 'username', expired in 100 seconds
  wsCache.set('username', 'wqteam', 100);
  
  // get 'username' 
  wsCache.get('username');
  
  // delete 'username'
  wsCache.delete('username');
  
  // Clear all keys
  wsCache.clear();
  
  // Set a new expiration time for an existing key.
  wsCache.touch('username', 1000);
  
  // Add key-value item to cache, success only when the key is not exists in cache
  wsCache.add('username2', 'wqteam', 1000);
  
  
  
  
```


