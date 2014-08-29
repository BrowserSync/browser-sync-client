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
            sinon.assert.calledWithExactly(socketStub, "browser:location", "socket");
        });
    });
    describe("socketEvent():", function () {

        var urlStub, func, canSyncStub;
        before(function () {
            urlStub = sinon.stub(location, "setUrl");
            func = location.socketEvent(bs);
            canSyncStub= sinon.stub(bs, "canSync");
        });
        afterEach(function () {
            urlStub.reset();
            canSyncStub.reset();
        });
        after(function () {
            urlStub.restore();
            canSyncStub.restore();
        });
        it("should return a function", function () {
            assert.equal(typeof location.socketEvent() === "function", true);
        });
        it("should set url if cansync = true", function () {
            canSyncStub.returns(true);
            func({url: "/index.html"});
            sinon.assert.called(urlStub);
        });
        it("should not set url if cansync = false", function () {
            canSyncStub.returns(false);
            func({url: "/index.html"});
            sinon.assert.notCalled(urlStub);
        });
        it("should set url if `canSync` = false, but `override` = true", function () {
            canSyncStub.returns(false);
            func({url: "/index.html", override: true});
            sinon.assert.calledOnce(urlStub);
        });
    });
});