describe("The scroll Plugin", function () {

    var scroll = window.__bs_scroll__;
    var bs = __bs_stub__;
    var scrollSpaceStub;
    var scrollPositionStub;

    beforeEach(function () {
        scroll.init(bs, __bs_events__);
    });

    beforeEach(function () {
        scrollSpaceStub    = sinon.stub(bs.utils, "getScrollSpace");
        scrollPositionStub = sinon.stub(bs.utils, "getBrowserScrollPosition");
    });


    afterEach(function () {
        scrollSpaceStub.restore();
        scrollPositionStub.restore();
    });

    it("getScrollTopPercentage(): 1", function () {
        scrollSpaceStub.returns({x:0, y:1000});
        var actual   = scroll.getScrollTopPercentage({x:0, y:500});
        var expected = 0.5;
        assert.equal(actual, expected);
    });
    it("getScrollTopPercentage(): 2", function () {
        scrollSpaceStub.returns({x:0, y:1000});
        var actual   = scroll.getScrollTopPercentage({x:0, y:250});
        var expected = 0.25;
        assert.equal(actual, expected);
    });
    it("scrollEvent(): 1", function () {
        var stub = sinon.stub(window, "scrollTo");
        scroll.scrollEvent(bs)({position: {raw: 100}});
        sinon.assert.calledWithExactly(stub, 0, 100);
        stub.restore();
    });
    it("scrollEvent(): 2", function () {
        var stub = sinon.stub(window, "scrollTo");
        scrollSpaceStub.returns({x:0, y:1000});
        bs.opts.scrollProportionally = true;
        scroll.scrollEvent(bs)({position: {proportional: 0.5}});
        sinon.assert.calledWithExactly(stub, 0, 500);
        stub.restore();
    });
    it("scrollEvent(): 3", function () {
        var stub = sinon.stub(window, "scrollTo");
        scrollSpaceStub.returns({x:0, y:1000});
        bs.opts.scrollProportionally = true;
        scroll.scrollEvent(bs)({position: {proportional: 0.25}});
        sinon.assert.calledWithExactly(stub, 0, 250);
        stub.restore();
    });
    it("should return early if cannot sync", function () {
        scrollSpaceStub.returns({x:0, y:1000});
        var stub   = sinon.stub(bs, "canSync").returns(false);
        var actual = scroll.scrollEvent(bs)({raw: {x: 0, y:200 }});
        assert.equal(actual, false);
    });

    describe("watch scroll", function () {

        var stub;
        before(function () {
            stub   = sinon.stub(scroll, "getScrollPosition").returns({
                proportional: 0.5,
                raw: 100
            });
        });
        afterEach(function () {
            stub.reset();
        });
        after(function () {
            stub.restore();
        });

        it("should emit event if can scroll", function () {
            var spy    = sinon.spy();
            var socket = {emit: spy};
            scroll.canEmitEvents = true;
            scroll.watchScroll(socket)();
            sinon.assert.calledWithExactly(spy, "scroll", {
                position: {
                    proportional: 0.5,
                    raw: 100
                }
            });
        });
        it("should not emit", function () {
            var spy    = sinon.spy();
            var socket = {emit: spy};
            scroll.canEmitEvents = false;
            scroll.watchScroll(socket, false)();
            sinon.assert.notCalled(spy);
        });
    });

    describe("getScrollPercentage(): ", function(){
        it("should return x & y values: 1", function(){
            var actual   = scroll.getScrollPercentage({x:0, y:1000}, {x:0, y:250});
            assert.equal(actual.y, 0.25);
        });
        it("should return x & y values: 2", function(){
            var actual   = scroll.getScrollPercentage({x:0, y:1000}, {x:0, y:100});
            assert.equal(actual.y, 0.1);
        });
    });

    describe("getScrollPosition(): ", function(){
        it("w", function(){
//            var stub = sinon.stub(scroll, "getScrollTop").returns({x:0, y:1000}, {x:0, y:100});
//            var actual   = scroll.getScrollPosition();
//            assert.equal(actual.raw.x, 0);
//            assert.equal(actual.raw.y, 1000);
//            assert.equal(actual.proportional, 0.25);
//            stub.restore();
        });
    });
});