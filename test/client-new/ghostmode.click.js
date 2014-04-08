describe("The click Plugin", function () {

    var clicks = window.__bs_clicks__;
    var bs     = __bs_stub__;
    var bodyStub, eventStub;

    before(function () {
        bodyStub  = sinon.stub(clicks.utils, "getBody").returns("BODY");
        eventStub = sinon.stub(__bs_events__, "addEvent");
    });

    beforeEach(function () {
        clicks.canEmitEvents = true;
    });

    after(function () {
        bodyStub.restore();
        eventStub.restore();
    });

    it("should init correctly", function() {
        var browserEventStub = sinon.stub(clicks, "browserEvent").returns("EVENT");
        var socketEventStub  = sinon.stub(clicks, "socketEvent").returns("socketEvent");
        var socketStub       = sinon.stub(bs.socket, "on").returns("socket");

        clicks.init(bs, __bs_events__);

        sinon.assert.calledOnce(bodyStub);
        sinon.assert.calledWithExactly(eventStub, "BODY", "click", "EVENT");
        sinon.assert.calledWithExactly(socketStub, "click", "socketEvent");

        sinon.assert.calledWithExactly(browserEventStub, bs.socket);
        sinon.assert.calledWithExactly(socketEventStub, bs, __bs_events__);

        browserEventStub.restore();
        socketEventStub.restore();
        socketStub.restore();
    });

    describe("Getting index of an element", function () {
        it("should return the correct index", function () {
            var elem = {id: "abx"};
            var stub = sinon.stub(document, "getElementsByTagName").returns([elem, {id: "xab"}]);
            var actual   = clicks.getElementIndex("link", elem);
            var expected = 0;
            assert.equal(actual, expected);
            stub.restore();
        });
        it("should return the correct index", function () {
            var elem = {id: "xab"};
            var stub = sinon.stub(document, "getElementsByTagName").returns([{id: "abx"}, elem]);
            var actual   = clicks.getElementIndex("link", elem);
            var expected = 1;
            assert.equal(actual, expected);
            stub.restore();
        });
    });

    describe("Getting element data for socket event", function(){
        it("should return an object containing element info", function(){
//            var elem = {
//                tagName: "link"
//            }
//            var actual   = clicks.getElementData(elem);
//            assert.equal(actual.tagName, "link");
//            assert.equal(actual.index, 0);
        });
    });


    describe("browserEvent(): ", function(){
        it("should add click events to body", function(){

        });
    });

});