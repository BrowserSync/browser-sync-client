describe("Generic Browser utils", function(){
    var browserUtils;
    before(function () {
        browserUtils = window.__bs_utils__;
    });
    describe("getScrollPosition(): ", function () {
        var act;
        before(function () {
            act = function () {
                return browserUtils.utils.getBrowserScrollPosition();
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

//    describe("getting a single element", function(){
//        var fakeElems = [
//            {
//                id: "item1",
//                tagName: "link"
//            },
//            {
//                id: "item2",
//                tagName: "link"
//            }
//        ], stub;
//        before(function(){
//            stub = sinon.stub(document, "getElementsByTagName").returns(fakeElems);
//        });
//        after(function () {
//            stub.restore();
//        });
//        it("should call getElementsByTagName() with the tagname", function(){
//            clicks.getSingleElement("link", 0);
//            sinon.assert.calledWithExactly(stub, "link");
//        });
//        it("should return the correct index: 1", function(){
//            var actual   = clicks.getSingleElement("link", 0);
//            var expected = "item1";
//            assert.equal(actual.id, expected);
//        });
//        it("should return the correct index: 2", function(){
//            var actual   = clicks.getSingleElement("link", 1);
//            var expected = "item2";
//            assert.equal(actual.id, expected);
//            stub.restore();
//        });
//    });


//    describe("Getting index of an element", function () {
//        it("should return the correct index", function () {
//            var elem     = {id: "abx"};
//            var stub     = sinon.stub(document, "getElementsByTagName").returns([elem, {id: "xab"}]);
//            var actual   = clicks.getElementIndex("link", elem);
//            var expected = 0;
//            assert.equal(actual, expected);
//            stub.restore();
//        });
//        it("should return the correct index", function () {
//            var elem     = {id: "xab"};
//            var stub     = sinon.stub(document, "getElementsByTagName").returns([{id: "abx"}, elem]);
//            var actual   = clicks.getElementIndex("link", elem);
//            var expected = 1;
//            assert.equal(actual, expected);
//            stub.restore();
//        });
//    });

//    describe("Getting element data for socket event", function(){
//        var indexStub;
//        before(function () {
//            indexStub = sinon.stub(clicks, "getElementIndex").returns(0);
//        });
//        after(function () {
//            indexStub.restore();
//        });
//        it("should return an object containing element info", function(){
//            var elem = {
//                tagName: "link"
//            };
//            var actual   = clicks.getElementData(elem);
//            assert.equal(actual.tagName, "link");
//            assert.equal(actual.index, 0);
//        });
//    });