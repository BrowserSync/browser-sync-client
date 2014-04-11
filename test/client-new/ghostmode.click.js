describe("The click Plugin", function () {

    var clicks = window.__bs_clicks__;
    var bs     = __bs_stub__;
    var bodyStub, eventStub, browserEventStub, socketEventStub, socketStub;

    before(function () {
        bodyStub         = sinon.stub(clicks.utils, "getBody").returns("BODY");
        eventStub        = sinon.stub(__bs_events__, "addEvent");
        browserEventStub = sinon.stub(clicks, "browserEvent").returns("EVENT");
        socketEventStub  = sinon.stub(clicks, "socketEvent").returns("socketEvent");
        socketStub       = sinon.stub(bs.socket, "on").returns("socket");
        socketStubEmit   = sinon.stub(bs.socket, "emit").returns("socket");
    });

    beforeEach(function () {
        clicks.canEmitEvents = true;
    });

    after(function () {
        bodyStub.restore();
        eventStub.restore();
        browserEventStub.restore();
        socketEventStub.restore();
        socketStub.restore();
        socketStubEmit.restore();
    });

    it("should init correctly", function() {

        clicks.init(bs, __bs_events__);

        sinon.assert.calledOnce(bodyStub);
        sinon.assert.calledWithExactly(eventStub, "BODY", "click", "EVENT");
        sinon.assert.calledWithExactly(socketStub, "click", "socketEvent");

        sinon.assert.calledWithExactly(browserEventStub, bs.socket);
        sinon.assert.calledWithExactly(socketEventStub, bs, __bs_events__);

    });

    describe("Getting index of an element", function () {
        it("should return the correct index", function () {
            var elem     = {id: "abx"};
            var stub     = sinon.stub(document, "getElementsByTagName").returns([elem, {id: "xab"}]);
            var actual   = clicks.getElementIndex("link", elem);
            var expected = 0;
            assert.equal(actual, expected);
            stub.restore();
        });
        it("should return the correct index", function () {
            var elem     = {id: "xab"};
            var stub     = sinon.stub(document, "getElementsByTagName").returns([{id: "abx"}, elem]);
            var actual   = clicks.getElementIndex("link", elem);
            var expected = 1;
            assert.equal(actual, expected);
            stub.restore();
        });
    });

    describe("Getting element data for socket event", function(){
        var indexStub;
        before(function () {
            indexStub = sinon.stub(clicks, "getElementIndex").returns(0);
        });
        after(function () {
            indexStub.restore();
        });
        it("should return an object containing element info", function(){
            var elem = {
                tagName: "link"
            };
            var actual   = clicks.getElementData(elem);
            assert.equal(actual.tagName, "link");
            assert.equal(actual.index, 0);
        });
    });


    describe("browserEvent(): ", function(){
        var getDataStub, eventMock, func, dataStub;
        before(function () {
            browserEventStub.restore();
            dataStub = {
                tagName: "DIV",
                index: 0
            };
            getDataStub = sinon.stub(clicks, "getElementData").returns(dataStub);
        });
        beforeEach(function(){
            eventMock = {
                target: {},
                type: "DIV"
            };
            socketStubEmit.reset();
            func = clicks.browserEvent(bs.socket);
        });
        after(function () {
            getDataStub.restore();
        });
        it("should add click events to body", function(){
            func(eventMock);
        });
        it("should return early if element type is checkbox or radio", function(){
            eventMock.target.type = "radio";
            func(eventMock);
            sinon.assert.notCalled(socketStubEmit);
        });
        it("should emit the event", function(){
            func(eventMock);
            sinon.assert.calledWithExactly(socketStubEmit, "click", dataStub);
        });
        it("should emit only if the flag is true", function(){
            clicks.canEmitEvents = false;
            func(eventMock);
            sinon.assert.notCalled(socketStubEmit);
        });
        it("should reset the flag if was initially false", function(){
            clicks.canEmitEvents = false;
            func(eventMock);
            assert.equal(clicks.canEmitEvents, true);
        });
    });

    describe("socketEvent(): ", function(){

        var func, canSyncStub, triggerClick, elemStub;
        before(function(){
            socketEventStub.restore();
            func            = clicks.socketEvent(bs, __bs_events__);
            canSyncStub     = sinon.stub(bs, "canSync").returns(true);
            triggerClick    = sinon.stub(__bs_events__, "triggerClick");
            elemStub        = sinon.stub(clicks, "getSingleElement").returns(true);
        });
        afterEach(function () {
            canSyncStub.reset();
            elemStub.reset();
            triggerClick.reset();
        });
        after(function () {
            canSyncStub.restore();
            triggerClick.restore();
            elemStub.restore();
        });
        it("should return early if cannot sync", function(){
            canSyncStub.returns(false);
            func({});
            sinon.assert.notCalled(triggerClick);
        });
        it("should call triggerClick() if canSync is true", function(){
            canSyncStub.returns(true);
            func({});
            sinon.assert.called(triggerClick);
        });
        it("should not attempt to trigger a click if element does not exist", function(){
            canSyncStub.returns(true);
            elemStub.returns(false);
            func({});
            sinon.assert.notCalled(triggerClick);
        });
    });

    describe("getting a single element", function(){
        var fakeElems = [
            {
                id: "item1",
                tagName: "link"
            },
            {
                id: "item2",
                tagName: "link"
            }
        ], stub;
        before(function(){
            stub = sinon.stub(document, "getElementsByTagName").returns(fakeElems);
        });
        after(function () {
            stub.restore();
        });
        it("should call getElementsByTagName() with the tagname", function(){
            clicks.getSingleElement("link", 0);
            sinon.assert.calledWithExactly(stub, "link");
        });
        it("should return the correct index: 1", function(){
            var actual   = clicks.getSingleElement("link", 0);
            var expected = "item1";
            assert.equal(actual.id, expected);
        });
        it("should return the correct index: 2", function(){
            var actual   = clicks.getSingleElement("link", 1);
            var expected = "item2";
            assert.equal(actual.id, expected);
            stub.restore();
        });
    });
});