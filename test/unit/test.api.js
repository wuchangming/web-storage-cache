var testDataTypes = {
    'number': [-12891, -1, 0, 1, 182918, 1.21, -121.21212],
    'string': ['wu', 'woqu', '123', '@#$%#@$!@?/11', '000', '   '],
    'boolean': [false, true],
    'object': [
        {
            firstName: 'wu',
            lastName: 'changming'
        },{
            // empty
        }
    ],
    'array': [
        ['a', 'asdfb', 'c'],
        [1 ,2 ,3],
        [1.1, 1.3, 3.00],
        [false, true, true],
        [{a: 1}, {b: 1}, {c: 'a'}],
        [1, 'asdf', 3.23, false, {ss: 'asdf'}]
    ]
};

var storage = window.localStorage;

function clearStorage() {
    storage.clear();
}
describe('WebStorageCache', function() {
    'use strict';
    before(function() {
        clearStorage();
        this.wsCache = new WebStorageCache(storage);
    });
    after(function() {
        clearStorage();
    });
    describe('#WebStorageCache', function() {
        it('should be a function', function(){
            expect(WebStorageCache).to.be.a('function');
        });
    });
    describe('#set,#get', function() {

        it('should be a function', function() {
            expect(this.wsCache.set).to.be.a('function');
        });

        describe('serializer', function() {
            beforeEach(function() {
                clearStorage();
            });

            for (var type in testDataTypes) {
                for(var i = 0; i < testDataTypes[type].length; i++) {
                    var value = testDataTypes[type][i];
                    it('should return the same type `' + type + '` and value :'+ JSON.stringify(value), (function(value) {
                        return function() {
                            this.wsCache.set('lWsCacheTestDataTypes', value);
                            var gValue = this.wsCache.get('lWsCacheTestDataTypes');
                            expect(gValue).to.deep.equal(value);
                            expect(typeof gValue).to.be.equal(typeof value);
                        };
                    })(value));
                }
            }

        });

        describe('expires', function() {
            beforeEach(function() {
                clearStorage();
            });
            it('should be get null when #set options: {exp: 3} after 3 seconds', function(done) {
                this.timeout(5000);
                var value = 'test';
                this.wsCache.set('testExpires', value, {exp: 3});
                expect(this.wsCache.get('testExpires')).to.be.deep.equal(value);
                var _this = this;
                setTimeout(function() {
                    expect(_this.wsCache.get('testExpires')).to.be.deep.equal(value);
                }, 2000);
                setTimeout(function() {
                    expect(_this.wsCache.get('testExpires') === null);
                    done();
                }, 3000);
            });
        });
    });
});
