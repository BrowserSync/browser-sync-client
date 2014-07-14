describe("The Notify Element", function() {

    var notify = window.__bs_notify__;
    var bs     = window.__bs_stub__;
    bs.emitter = window.__bs_emitter__;

    it("can be initialised", function() {
        var elem     = notify.init(bs);
        var actual   = elem.style.backgroundColor;
        var expected = "rgb(27, 32, 50)";
        assert.equal(actual, expected);
    });
    it("can be initialised with custom styles", function() {

        bs.opts.notify = {
            styles: [
                "background-color: yellow",
                "color: black",
                "padding: 10px",
                "display: none",
                "font-family: sans-serif",
                "position: absolute",
                "z-index: 9999",
                "right: 0px",
                "border-bottom-left-radius: 5px"
            ]
        };
        var elem     = notify.init(bs);
        var actual   = elem.style.backgroundColor;
        var expected = "yellow";
        assert.equal(actual, expected);
    });

    it("can return a callback for watching", function(){
        var stub = sinon.stub(notify, "flash");
        var cb   = notify.watchEvent();
        cb({message: "custom message"});
        sinon.assert.calledWithExactly(stub, "custom message", undefined);
        stub.restore();
    });

    it("should register an listener on the emitter", function () {
        var spy = sinon.spy(bs.emitter, "on");
        notify.init(bs);
        var actual   = spy.getCall(0).args[0];
        var expected = "notify";
        assert.equal(actual, expected);
        spy.restore();
    });
    it("should register an listener on the socket", function () {
        var spy = sinon.spy(bs.socket, "on");
        notify.init(bs);
        var actual   = spy.getCall(0).args[0];
        var expected = "browser:notify";
        assert.equal(actual, expected);
        spy.restore();
    });

    describe("Flashing", function () {

        var elemStub;
        var scrollStub;
        var fakeElem;
        before(function () {
            fakeElem = {
                innerHTML: "",
                style: {
                    top: "",
                    display: ""
                }
            };
            elemStub   = sinon.stub(notify, "getElem");
            scrollStub = sinon.stub(notify, "getScrollTop").returns(100);
        });
        afterEach(function () {
            scrollStub.reset();
        });
        after(function () {
            elemStub.restore();
            scrollStub.restore();
        });
        it("should return early if no ELEM", function () {
            elemStub.returns(false);
            var actual = notify.flash();
            assert.equal(actual, false);
        });
        it("should hide the notify elem ", function(){

            elemStub.returns(fakeElem);
            var clock = sinon.useFakeTimers();
            var elem = notify.flash("MESSAGE");

            clock.tick(2010);

            var actual    = elem.style.display;
            var expected = "none";

            assert.equal(actual, expected);
            clock.restore();
        });

    });

    // Utils
    it("should retrieve elem from closure", function () {
        var elem = notify.getElem();
    });
    it("should return 0 if no access to utils", function () {
        var stub = sinon.stub(bs.utils, "getBrowserScrollPosition").returns({x:0, y:500});
        var actual   = notify.getScrollTop();
        var expected = 500;
        assert.equal(actual, expected);
        stub.restore();
    });
});