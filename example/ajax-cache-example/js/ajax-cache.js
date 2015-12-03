(function(){
    /**    1.使用默认配置的缓存：存到localStorage中，缓存 1 小时.
    *    $.ajax({
    *       wsCache: true
    *     })
    *
    *    2.自定义：
    *        $.ajax({
    *            wsCache: {
    *            storageType: 'sessionStorage',   //缓存到sessionStorage中
    *            cacheKey: 'XXXX-cmd', // 自定义缓存key, 默认规则参考：genCacheKey(options)
    *            exp: 10 * 60,  // 缓存 10 分钟
    *            version: '1.0.0' // 缓存版本号
    *        }
    *        });
    *
    * Reference:
    *        1.https://github.com/SaneMethod/jquery-ajax-localstorage-cache
    *        2.http://api.jquery.com/jQuery.ajaxPrefilter/
    *        3.http://api.jquery.com/jQuery.ajaxTransport/
    */
    var defaultExpires = 60 * 60; //exp: 60 * 60 expires in 1 hour.

    var defaultStorageType = 'localStorage';

    var wsCacheMap = {
        sessionStorage: new WebStorageCache({
            storage: 'sessionStorage'
        }),
        localStorage: new WebStorageCache({
            storage: 'localStorage'
        })
    };
    // 启动前手动清除已过期数据
    wsCacheMap.sessionStorage.deleteAllExpires();
    wsCacheMap.localStorage.deleteAllExpires();

    function genCacheKey(options){
        var dataString = options.data;
        try {
            dataString = JSON.stringify(options.data);
        } catch (e) {
            console.error(e);
        }
        return options.wsCache.cacheKey || options.url.replace(/jQuery.*/,'') + options.type.toUpperCase() + (dataString || '') + (options.wsCache.version || '1.0.0');
    };

    $.ajaxPrefilter(function(options) {
        if(options.wsCache) {
            var storageType = options.wsCache.storageType ? options.wsCache.storageType : defaultStorageType;
            var wsCache = wsCacheMap[storageType] || wsCacheMap[defaultStorageType];

            if(!wsCache.isSupported()) {
                return;
            }

            try {
                var data = options.data && JSON.parse(options.data);
                var wsCacheOptions = options.wsCache;
                var cacheKey = genCacheKey(options);
                var value = wsCache.get(cacheKey);

                if (!value){
                    // If it not in the cache, we store the data, add success callback - normal callback will proceed
                    if (options.success) {
                        options.realsuccess = options.success;
                    }
                    options.success = function(data) {

                        var exp = defaultExpires;
                        if(typeof wsCacheOptions.exp === 'number') {
                            exp = wsCacheOptions.exp;
                        }
                        try {
                            // TODO :这里应该加上业务逻辑的判断这个请求是否真正成功的请求。
                            wsCache.set(cacheKey, data, {exp: exp});
                        } catch(e){
                            console.log(e);
                        }


                        if (options.realsuccess) options.realsuccess(data);
                    };

                }

            } catch (e) {
                console.error(e);
            }
        } else {
            return;
        }
    });

    /**
    * This function performs the fetch from cache portion of the functionality needed to cache ajax
    * calls and still fulfill the jqXHR Deferred Promise interface.
    * See also $.ajaxPrefilter
    * @method $.ajaxTransport
    * @params options {Object} Options for the ajax call, modified with ajax standard settings
    */
    $.ajaxTransport("+*", function(options){
        if (options.wsCache) {
            var storageType = options.wsCache.storageType ? options.wsCache.storageType : defaultStorageType;
            var wsCache = wsCacheMap[storageType] || wsCacheMap[defaultStorageType];

            if(!wsCache.isSupported()) {
                return;
            }

            var cacheKey = genCacheKey(options),
            value = wsCache.get(cacheKey);

            if (value){
                console.log('read from localStorage cacahe!!');
                return {
                    send: function(headers, completeCallback) {
                        var response = {};
                        response['json'] = value;
                        completeCallback(200, 'success', response, '');
                    },
                    abort: function() {
                        console.log("Aborted ajax transport for json cache.");
                    }
                };
            }
        }
    });


})();
