// Run before window.onload to make sure the specs have access to describe()
// and other mocha methods. All feels very hacky though :-/
this.mocha.setup('bdd');
var expect = chai.expect;
function runTests() {
    var runner = this.mocha.run();

}

if (this.addEventListener) {
    this.addEventListener('load', runTests);
} else if (this.attachEvent) {
    this.attachEvent('onload', runTests);
}
