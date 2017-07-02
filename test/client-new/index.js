describe("Init method", function(){

    var index       = window.__bs_index__;
    var notify      = window.__bs_notify__;
    var ghostMode   = window.__bs_ghost_mode__;
    var bs          = window.__bs_stub__;
    var codeSync    = window.__bs_code_sync__;
    var BrowserSync = window.__bs;
    var notifySpy;
    var notifyFlashSpy;
    var ghostStub;
    var codeSyncStub;

    before(function () {
        notifySpy       = sinon.stub(notify, "init");
        notifyFlashSpy  = sinon.stub(notify, "flash");
        ghostStub       = sinon.stub(ghostMode, "init");
        codeSyncStub    = sinon.stub(codeSync, "init");
    });
    beforeEach(function () {
        window.___browserSync___ = {};
    });
    afterEach(function (){
        delete window.___browserSync___;
    });
    after(function () {
        notifySpy.restore();
        notifyFlashSpy.restore();
        ghostStub.restore();
        codeSyncStub.restore();
    });
    it("should initialize", function(){
        index.init(bs.options);
        sinon.assert.called(notifySpy);
        sinon.assert.called(notifyFlashSpy);
        sinon.assert.called(ghostStub);
        sinon.assert.called(codeSyncStub);
    });
    it("should expose browserSync instance", function(){
        var spy = sinon.spy();
        var BS = window.___browserSync___;
        index.init(bs.options);
        assert.equal(typeof BS.use === "function", true);
        BS.use(spy);
        sinon.assert.calledWith(spy, sinon.match.instanceOf(BrowserSync));
    });
});