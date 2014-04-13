var inputs  = require("./ghostmode.forms.input");
var toggles = require("./ghostmode.forms.toggles");
var submit  = require("./ghostmode.forms.submit");

exports.init = function (bs, eventManager) {
    inputs.init(bs, eventManager);
    toggles.init(bs, eventManager);
    submit.init(bs, eventManager);
};