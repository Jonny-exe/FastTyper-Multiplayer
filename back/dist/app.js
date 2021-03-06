"use strict"
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value)
				  })
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected)
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next())
		})
	}
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1]
					return t[1]
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === "function" &&
				(g[Symbol.iterator] = function () {
					return this
				}),
			g
		)
		function verb(n) {
			return function (v) {
				return step([n, v])
			}
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.")
			while (_)
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y["return"]
									: op[0]
									? y["throw"] || ((t = y["return"]) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t
					if (((y = 0), t)) op = [op[0] & 2, t.value]
					switch (op[0]) {
						case 0:
						case 1:
							t = op
							break
						case 4:
							_.label++
							return { value: op[1], done: false }
						case 5:
							_.label++
							y = op[1]
							op = [0]
							continue
						case 7:
							op = _.ops.pop()
							_.trys.pop()
							continue
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0
								continue
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1]
								break
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1]
								t = op
								break
							}
							if (t && _.label < t[2]) {
								_.label = t[2]
								_.ops.push(op)
								break
							}
							if (t[2]) _.ops.pop()
							_.trys.pop()
							continue
					}
					op = body.call(thisArg, _)
				} catch (e) {
					op = [6, e]
					y = 0
				} finally {
					f = t = 0
				}
			if (op[0] & 5) throw op[1]
			return { value: op[0] ? op[1] : void 0, done: true }
		}
	}
Object.defineProperty(exports, "__esModule", { value: true })
var db_1 = require("./db")
var env_1 = require("./env")
var app = require("express")()
var http = require("http").createServer(app)
require("source-map-support").install()
var io = require("socket.io")(http, env_1.CORS)
io.use(function (socket, next) {
	var username = socket.handshake.auth.username
	if (!username) {
		return next(new Error("invalid username"))
	}
	socket.username = username
	next()
})
io.on("connection", function (socket) {
	return __awaiter(void 0, void 0, void 0, function () {
		var username, isLider, users, sendInfo
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					username = socket.username
					console.log(username + " connected")
					return [
						4 /*yield*/,
						db_1.query("insert into users (username, progress) values ($1, 0)", [
							username,
						]),
					]
				case 1:
					_a.sent()
					return [4 /*yield*/, db_1.query("select username, progress from users")]
				case 2:
					users = _a.sent()
					if (!(users.length === 1)) return [3 /*break*/, 4]
					return [
						4 /*yield*/,
						db_1.query("update text set lider = $1::text, quote = ''", [username]),
					]
				case 3:
					_a.sent()
					sendInfo = { lider: username, quote: "" }
					isLider = true
					io.emit("text", sendInfo)
					_a.label = 4
				case 4:
					io.emit("users", users)
					socket.on("update-progress", function (_a) {
						var username = _a.username,
							progress = _a.progress
						return __awaiter(void 0, void 0, void 0, function () {
							var users
							return __generator(this, function (_b) {
								switch (_b.label) {
									case 0:
										db_1.query(
											"update users set progress = $1::int where username = $2::text",
											[progress, username]
										)
										return [
											4 /*yield*/,
											db_1.query("select username, progress from users"),
										]
									case 1:
										users = _b.sent()
										io.emit("users", users)
										return [2 /*return*/]
								}
							})
						})
					})
					socket.on("update-text", function (_a) {
						var quote = _a.quote,
							lider = _a.lider
						return __awaiter(void 0, void 0, void 0, function () {
							return __generator(this, function (_b) {
								switch (_b.label) {
									case 0:
										return [
											4 /*yield*/,
											db_1.query(
												"update text set quote = $1::text where lider = $2::text",
												[quote, lider]
											),
										]
									case 1:
										_b.sent()
										io.emit("text", { quote: quote, lider: lider })
										return [2 /*return*/]
								}
							})
						})
					})
					socket.on("disconnect", function () {
						return __awaiter(void 0, void 0, void 0, function () {
							var newLider, newUsers
							return __generator(this, function (_a) {
								switch (_a.label) {
									case 0:
										return [
											4 /*yield*/,
											db_1.query("delete from users where username = $1::text", [
												username,
											]),
										]
									case 1:
										_a.sent()
										console.log(username + " disconnected")
										if (!(isLider == true)) return [3 /*break*/, 4]
										return [
											4 /*yield*/,
											db_1.query("select username from users where username <> $1::text", [
												username,
											]),
										]
									case 2:
										newLider = _a.sent()
										newLider = newLider.length > 0 ? newLider[0].username : ""
										return [
											4 /*yield*/,
											db_1.query("update text set lider = $1::text", [newLider]),
										]
									case 3:
										_a.sent()
										io.emit("text", { lider: newLider, quote: "" })
										_a.label = 4
									case 4:
										return [
											4 /*yield*/,
											db_1.query("select username, progress from users"),
										]
									case 5:
										newUsers = _a.sent()
										io.emit("users", newUsers)
										return [2 /*return*/]
								}
							})
						})
					})
					return [2 /*return*/]
			}
		})
	})
})
http.listen(4000, function () {
	console.log("listening on *:4000")
})
//# sourceMappingURL=app.js.map
