"use strict";
var app = require("express")();
var http = require("http").createServer(app);
// server-side
var io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});
io.use(function (socket, next) {
    var username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    socket.username = username;
    next(null);
});
io.on("connection", function (socket) {
    console.log("connection has been made");
    socket.on("new-operations", function (data) {
        console.log(data);
        io.emit("new-remote-operations", data);
    });
});
http.listen(4000, function () {
    console.log("listening on *:4000");
});
