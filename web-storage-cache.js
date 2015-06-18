/*
 * WebStorageCache - 0.0.1
 * https://github.com/WQTeam/web-storage-cache
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.WebStorageCache = factory();
	}
}(this, function () {
	"use strict"

	var _maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

	function _extend(obj, props) {
		for (var key in props) obj[key] = props[key]
		return obj;
	}
	
	function isObject(item) {
		return item === Object(item);
	}

	// https://github.com/jeromegn/Backbone.localStorage/blob/master/backbone.localStorage.js#L63
	var defaultSerializer = {
		serialize: function (item) {
			return isObject(item) ? JSON.stringify(item) : item;
		},
		// fix for "illegal access" error on Android when JSON.parse is
		// passed null
		deserialize: function (data) {
			return data && JSON.parse(data);
		}
	};
		
	/**
	 * https://github.com/gsklee/ngStorage/blob/master/ngStorage.js#L52
	 * 
	 * When Safari (OS X or iOS) is in private browsing mode, it appears as
	 * though localStorage is available, but trying to call .setItem throws an
	 * exception below: "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was
	 * made to add something to storage that exceeded the quota."
	 */
	function _isStorageSupported (storage) {
		var supported = false;
		if (storage && storage.setItem ) {
			var key = '__' + Math.round(Math.random() * 1e7);
	       	try {
	       		storage.setItem(key, key);
	       		storage.removeItem(key);
	       	} catch (err) {
	       		supported = false;
	       	}
	       	supported = true;
		}
		return supported;
	}

	// get storage instance
	function _getStorageInstance(storage) {
		var type = typeof storage;
		if (type === 'string') {
			return window[storage];
		}
		return storage;
	}

	// cache item constructor
	function CacheItemConstructor (value, exp) {
		this.createTime = (new Date()).getTime();
		this.expires = exp;
		this.value = value;
	}

	// cache api 
	var CacheAPI = {

		set: function (key, value, options) {},

		get: function (key) {},

		delete: function (key) {},
		// Clear all keys
		clear: function () {},
		//Add key-value item to memcached, success only when the key is not exists in memcached.
		add: function (key, options) {},
		// Replace the key's data item in cache, success only when the key's data item is exists in cache.
		update: function (key, value, options) {},
		// Set a new expiration time for an existing key.
		touch: function (key, options) {}
	};

	// cache api 
	var CacheAPIImpl = {

		set: function(key, val, options) {
			
			if (val === undefined) {
				return this.delete(key) 
			}

			var value = this.serializer.serialize(val);

			var cacheItem;

			this.storage.setItem(key, cacheItem);
			return val
		},
		get: function (key) {},

		delete: function (key) {},
		// Clear all keys
		clear: function () {},
		//Add key-value item to memcached, success only when the key is not exists in memcached.
		add: function (key, options) {},
		// Replace the key's data item in cache, success only when the key's data item is exists in cache.
		update: function (key, value, options) {},
		// Set a new expiration time for an existing key.
		touch: function (key, options) {}
	};
	
	/**
	 * Cache Constructor
	 */
	function CacheConstructor (options) {
		
		// default options
		var defaults = {
			storage: 'localStorage',
			serializer : defaultSerializer, // defalut serializer
			exp: 60 * 60  //An expiration time, in seconds. default 3600.
		};
		
		var opt = _extend(defaults, options);

		var storage = _getStorageInstance(opt.storage);
		
		var isSupported = _isStorageSupported(storage);
		
		this.isSupported = isSupported;
		
		if (isSupported) {

			this.storage = storage;

			this.serializer = opt.serializer;

			CacheConstructor.prototype = CacheAPIImpl;

		} else {  // if not support, rewrite all functions without doing anything
			CacheConstructor.prototype = CacheAPI;
		}
		
	}
	
	return CacheConstructor;
	
}));
