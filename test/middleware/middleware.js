"use strict";

var index       = require("../../index.js");

var assert      = require("chai").assert;
var http        = require("http");
var request     = require("supertest");
var express     = require("express");

describe("Using the middleware", function () {

    var app;
    before(function () {
        app = express();
        app.use("/client", index.middleware()({minify: true}, "BEFORE"));
    });

    it("Returns a function", function () {
        assert.isFunction(index.middleware);
    });

    it("should return the JS", function (done) {
        request(app)
            .get("/client")
            .expect("Content-Type", /text\/javascript/)
            .expect(200)
            .end(function (err, res) {
                assert.isTrue(res.text.length > 0);
                assert.isTrue(res.text.indexOf("BEFORE") > -1);
                done();
            });
    });
});