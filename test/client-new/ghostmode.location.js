describe("The location Plugin", function () {

    var location = window.__bs_location__;
    var bs = __bs_stub__, socketStub, socketEventStub;

    describe("init():", function(){

        before(function(){
            socketStub      = sinon.stub(bs.socket, "on").returns("socket");
            socketEventStub = sinon.stub(location, "socketEvent").returns("socket");
        });
        afterEach(function () {
            socketStub.reset();
            socketEventStub.reset();
        });
        after(function () {
            socketStub.restore();
            socketEventStub.restore();
        });

        it("should be a function", function(){
            assert.equal(typeof location.init === "function", true);
        });
        it("should register an event on the socket", function () {
            location.init(bs);
            sinon.assert.calledWithExactly(socketStub, "location", "socket");
        });
    });
//    describe("socketEvent():", function () {
//
//        var urlStub, func;
//        before(function () {
//            urlStub = sinon.stub(location, "setUrl");
//            func = location.socketEvent(bs);
//        });
//        afterEach(function () {
//            urlStub.reset();
//        });
//        after(function () {
//            urlStub.restore();
//        });
//        it("should return a function", function () {
//            assert.equal(typeof location.socketEvent() === "function", true);
//        });
//        it("should set the url if url exists in event", function () {
//            func({url: "/index.html"});
//            sinon.assert.called(urlStub);
//        });
//        it("should not the url if url does not exist", function () {
//            func({});
//            sinon.assert.notCalled(urlStub);
//        });
//    });
});