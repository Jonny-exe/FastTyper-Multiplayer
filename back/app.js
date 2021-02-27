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
    next();
});
io.on("connection", function (socket) {
    socket.on("disconnect", function () {
        io.emit("users", getUsers());
        console.log("Disconnect");
    });
    socket.on("new-operations", function (data) {
        console.log("Data: ", data);
        io.emit("new-remote-operations", data);
    });
    console.log("Connection", socket.username);
    var getUsers = function () {
        var users = [];
        var sockets = io.of("/").sockets;
        sockets.forEach(function (socket) {
            users.push({
                username: socket.username,
                userID: socket.id
            });
        });
        return users;
    };
    io.emit("users", getUsers());
});
// notify existing users
http.listen(4000, function () {
    console.log("listening on *:4000");
});
