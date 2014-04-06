describe("The Notify Element", function() {

    var notify = window.__bs_notify__;
    var bs = window.__bs_stub__;
    bs.emitter = window.__bs_emitter__;
    bs.emitter   = window.__bs_emitter__;

    it("can be initialised", function() {
        var elem     = notify.init(bs);
        var actual   = elem.style.backgroundColor;
        var expected = "black";
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
        var elem   = notify.init(bs);
        var actual = elem.style.backgroundColor;
        var expected = "yellow";
        assert.equal(actual, expected);
    });

    it("can return a callback for watching", function(){
        var stub = sinon.stub(notify, "flash");
        var cb  = notify.watchEvent();
        cb({message: "custom message"});
        sinon.assert.calledWithExactly(stub, "custom message");
    });

    it("should register an listener on the emitter", function () {
        var spy = sinon.spy(bs.emitter, "on");
        notify.init(bs);
        var actual   = spy.getCall(0).args[0];
        var expected = "notify";
        assert.equal(actual, expected);
        spy.restore();
    });


});