var assert = require("chai").assert;
var middleware = require("../../index.js").middleware;
var http = require("http");
var request = require("supertest");
var express = require("express");
var app = express();

app.use("/client", middleware());

var string1 = "}(window, (typeof ___socket___ === \"undefined\") ? {} : ___socket___));";
var string2 = "if (typeof Array.prototype.indexOf === \"undefined\") {";

describe("Using the middleware", function () {

    it("Returns a function", function () {
        assert.isFunction(middleware);
    });

    it("should return the JS", function (done) {
        request(app)
            .get("/client")
            .expect("Content-Type", /text\/javascript/)
            .expect(200)
            .end(function (err, res) {
                assert(~res.text.indexOf(string1));
                assert(~res.text.indexOf(string2));
                done();
            });
    });
});