var storage = window.localStorage;

function clearStorage() {
    storage.clear();
}
describe('WebStorageCache', function() {
    'use strict';
    before(function() {
        clearStorage();
        this.wsCache = new WebStorageCache({
            storage: storage
        });
    });
    // after(function() {
    //     clearStorage();
    // });
    describe('#Constructor', function() {
        it('Constructor should be a function', function(){
            expect(WebStorageCache).to.be.a('function');
        });
        it('has the WebStorageCache API', function() {
            var wsCache = this.wsCache;
            expect(wsCache.isSupported).to.be.a('function');
            expect(wsCache.set).to.be.a('function');
            expect(wsCache.get).to.be.a('function');
            expect(wsCache.delete).to.be.a('function');
            expect(wsCache.deleteAllExpires).to.be.a('function');
            expect(wsCache.clear).to.be.a('function');
            expect(wsCache.touch).to.be.a('function');
            expect(wsCache.add).to.be.a('function');
            expect(wsCache.replace).to.be.a('function');
        });
        it('should set default expires success with number', function(done){
            this.timeout(5000);
            var cache = new WebStorageCache({
                exp: 3
            });
            cache.set('testDefaultExpires', '1');
            expect(cache.get('testDefaultExpires')).to.equal('1');
            setTimeout(function() {
                expect(cache.get('testDefaultExpires')).to.be.a('null');
                done();
            }, 3000);
        });
        it('should set default expires success with an outdate date', function(){
            var cache = new WebStorageCache({
                exp: new Date()
            });
            cache.set('testDefaultExpires', '3');
            expect(cache.get('testDefaultExpires')).to.be.a('null');
        });
        it('should set default expires success with an future date', function(){
            var date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            var cache = new WebStorageCache({
                exp: date
            });
            cache.set('testDefaultExpires', 1111);
            expect(cache.get('testDefaultExpires')).to.equal(1111);
        });
        it('should set default storage to `localStorage` success', function(){
            var localCache = new WebStorageCache({
                storage: 'localStorage'
            });
            localCache.set('testDefaultStorge', 'asdfw2');
            expect(localStorage.getItem('testDefaultStorge')).not.to.be.a('null');
            expect(sessionStorage.getItem('testDefaultStorge')).to.be.a('null');
        });
        it('should set default storage to `sessionStorage` success', function(){
            var localCache = new WebStorageCache({
                storage: 'sessionStorage'
            });
            localCache.set('testDefaultStorage', 'sadfsadf');
            expect(sessionStorage.getItem('testDefaultStorage')).not.to.be.a('null');
            expect(localStorage.getItem('testDefaultStorage')).to.be.a('null');
        });
    });
    describe('#isSupported', function() {
        it('should be true', function() {
            expect(this.wsCache.isSupported()).to.equal(true);
        });
    });
    describe('#set,#get', function() {

        describe('expires', function() {
            beforeEach(function() {
                clearStorage();
            });
            it('should be get null when invoke #set{exp: 3} after 3 seconds', function(done) {
                this.timeout(5000);
                var value = 'test';
                this.wsCache.set('testExpires', value, {exp: 3});
                expect(this.wsCache.get('testExpires')).to.be.deep.equal(value);
                var _this = this;
                setTimeout(function() {
                    console.log(_this.wsCache.get('testExpires'));
                    expect(_this.wsCache.get('testExpires')).to.be.a('null');
                    done();
                }, 3000);
            });
            it('should be null if set deadline is now', function() {
                var now = new Date();
                this.wsCache.set('testExpires', 'now', {exp: now});
                expect(this.wsCache.get('testExpires')).to.be.a('null');
            });
            it('should return value if set deadline is after one hour', function() {
                var now = new Date();
                var afterOneHour = new Date(now.getTime() + 1*60*60*1000);
                this.wsCache.set('testExpires', 'afterOneHour', {exp: afterOneHour});
                expect(this.wsCache.get('testExpires')).to.equal('afterOneHour');
            });
        });

    });
    describe('#delete', function() {
        it('should be null when invoke #delete', function() {
            var key = 'testDelete';
            this.wsCache.set(key, 'testDeleteValue', {exp: 1});
            this.wsCache.delete(key);
            expect((this.wsCache.get(key))).to.be.a('null');
        });
    });
    describe('#deleteAllExpires', function() {
        it('should be a null if items has been expired after delete all expires items', function() {
            var expiresKey = 'expiresKey';
            var notExpiresKey = 'notExpiresKey';
            var now = new Date();
            this.wsCache.set(expiresKey, 'expiresValue', {exp: now});
            this.wsCache.set(notExpiresKey, 'notExpiresValue');
            this.wsCache.deleteAllExpires();
            expect((this.wsCache.get(expiresKey))).to.be.a('null');
            expect((this.wsCache.get(notExpiresKey))).not.to.be.a('null');
        });
    });
    describe('#clear', function() {
        it('should clear all items not only created by WebStorageCache', function() {
            var WebStorageCachekey = 'WebStorageCachekey';
            var normalKey = 'normalKey';
            storage.setItem(normalKey, 'normalValue');
            this.wsCache.set(WebStorageCachekey, 'WebStorageCacheValue');
            this.wsCache.clear();
            expect(storage.getItem(normalKey)).to.be.a('null');
            expect(this.wsCache.get(WebStorageCachekey)).to.be.a('null');
        });
    });
    describe('#touch', function() {
        this.timeout(5000);
        it('should has a new expires time after `touch`', function(done) {
            var touchKey = 'touchKey';
            var touchKey2 = 'touchKey2';
            var touchKey3 = 'touchKey3';
            this.wsCache.set(touchKey, 'touchValue', {exp: 1});
            this.wsCache.set(touchKey2, 'touchValue2', {exp: 1});
            this.wsCache.set(touchKey3, 'touchValue2');
            this.wsCache.touch(touchKey, 5);
            this.wsCache.touch(touchKey3, 2);
            var _this = this;
            setTimeout(function() {
                expect(_this.wsCache.get(touchKey)).not.to.be.a('null');
                expect(_this.wsCache.get(touchKey2)).to.be.a('null');
                expect(_this.wsCache.get(touchKey3)).to.be.a('null');
                done();
            }, 3000);
        });
    });
    describe('#add', function() {
        it('should add item to storage ,success when the key is not exists', function() {
            var addKey = 'addKey';
            var value1 = '1';
            var value2 = '2';
            this.wsCache.add(addKey, value1);
            expect(this.wsCache.get(addKey)).to.equal(value1);
            this.wsCache.add(addKey, value2);
            expect(this.wsCache.get(addKey)).to.equal(value1);
        });
        it('should add item to storage ,success when the key is expires', function(done) {
            this.timeout(3000);
            var addKey = 'addKey';
            var value1 = '1';
            var value2 = '2';
            this.wsCache.set(addKey, value1, {exp: 1});
            var _this = this;
            setTimeout(function(){
                _this.wsCache.add(addKey, value2);
                expect(_this.wsCache.get(addKey)).to.equal(value2);
                done();
            }, 2000);
        });
    });
    describe('#replace', function() {
        beforeEach(function() {
            clearStorage();
        });
        it('should replace the key\'s data item in storage,success only when the key\'s data item is exists in storage.', function() {
            var replaceKey = 'replaceKey';
            var value1 = '1';
            var value2 = '2';
            this.wsCache.replace(replaceKey, value1);
            expect(this.wsCache.get(replaceKey)).to.be.a('null');
            this.wsCache.add(replaceKey, value1);
            this.wsCache.replace(replaceKey, value2);
            expect(this.wsCache.get(replaceKey)).to.equal(value2);
        });
        it('should reflash item\'s expires with new options', function(done) {
            this.timeout(3000);
            var replaceKey = 'replaceKey';
            var value1 = '1';
            this.wsCache.add(replaceKey, value1);
            this.wsCache.replace(replaceKey, value1, {exp: 1});
            var _this = this;
            setTimeout(function() {
                expect(_this.wsCache.get(replaceKey)).to.be.a('null');
                done();
            }, 2000);
        });
    });

});
