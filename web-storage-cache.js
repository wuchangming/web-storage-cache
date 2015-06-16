"use strict"

;(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.H5ClientCache = factory();
	}
	
}(this, function () {
	
	function _extend(obj, props) {
		for (var key in props) obj[key] = props[key]
		return obj;
	}
	
	function isObject(item) {
		  return item === Object(item);
	}
	
	/**
	 * 
	 * print log if window['H5ClientCache_debug'] == true
	 * 
	 */
	function _printLog (msg) {
		if (window['H5ClientCache_debug']) {
			console.log(msg);
		}
	}
	
	/**
	 * https://github.com/gsklee/ngStorage/blob/master/ngStorage.js#L52
	 * 
	 * When Safari (OS X or iOS) is in private browsing mode, it appears as
	 * though localStorage is available, but trying to call .setItem throws an
	 * exception below: "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was
	 * made to add something to storage that exceeded the quota."
	 */
	function _isSupported (storage) {
		
		if (storage && storage.setItem ) {
			var key = '__' + Math.round(Math.random() * 1e7);
	       	try {
	       		storage.setItem(key, key);
	        	storage.removeItem(key);
	       	} catch (err) {
	       		supported = false;
	       		_printLog (err);
	       	}
		} else {
			return !!storage;
		}
	}
	
	/**
	 * ClientCache Constructor
	 */
	function ClientCacheConstructor (options) {
		
		// default options
		var defaults = {
			storage: 'localStorage'
		};
		
		var opt = _extend(defaults, options);
		
		var isSupported = _isSupported(window[opt.storage]);
		
		this.isSupported = isSupported;
		
		if (isSupported) {
			
			var storage = window[opt.storage];
			
			// https://github.com/jeromegn/Backbone.localStorage/blob/master/backbone.localStorage.js#L63
			this.serializer = opt.serializer || {
			    serialize: function(item) {
			      return isObject(item) ? JSON.stringify(item) : item;
			    },
			    // fix for "illegal access" error on Android when JSON.parse is
				// passed null
			    deserialize: function (data) {
			      return data && JSON.parse(data);
			    }
			};
			
			this.set = function(key, val) {
				if (val === undefined) { return store.remove(key) }
				storage.setItem(key, this.serializer.serialize(val)))
				return val
			}
			
		} else {
			return;
		}
		
	}
	
	ClientCacheConstructor.prototype = {
		set: function() {},
		get: function() {},
		add: function() {},
		has: function() {},
		remove: function() {},
		clear: function() {}	
	};
	
	return ClientCacheConstructor;
	
}));
