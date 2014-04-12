var inputs = require("./ghostmode.forms.input");
var toggles  = require("./ghostmode.forms.toggles");

exports.init = function (bs, eventManager) {
    inputs.init(bs, eventManager);
    toggles.init(bs, eventManager);
};