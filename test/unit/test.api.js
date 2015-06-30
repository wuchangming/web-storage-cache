describe('WebStorageCache', function() {
    'use strict';
    before(function() {
        window.localStorage.clear();
        window.sessionStorage.clear();
        this.lWsCache = new WebStorageCache('localStorage');
        this.sWsCache = new WebStorageCache('sessionStorage');
    });
    describe('#WebStorageCache', function() {
        it('should be a function', function(){
            expect(WebStorageCache).to.be.a('function');
        });
    });
});
