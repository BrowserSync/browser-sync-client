describe("Generic Browser utils", function(){
    var browserUtils;
    before(function () {
        browserUtils = window.__bs_utils__;
    });
    describe("getScrollPosition(): ", function () {
        var act;
        before(function () {
            act = function () {
                return browserUtils.utils.getScrollPosition();
            };
        });
        it("should return x & y values", function(){
            var actual = act();
            assert.equal(actual.x, 0);
            assert.equal(actual.y, 0);
        });
    });
    describe("getScrollSpace(): 1", function () {
        var act;
        var documentStub;
        before(function () {
            act = function () {
                return browserUtils.utils.getScrollSpace();
            };
            documentStub = sinon.stub(browserUtils, "getDocument").returns({
                documentElement: {
                    clientWidth: 800,
                    clientHeight: 600
                },
                body: {
                    scrollHeight: 1000
                }
            });
        });
        it("should return x & y values", function(){
            var actual = act();
            assert.equal(actual.x, 200);
            assert.equal(actual.y, 400);
        });
    });
});