"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
var ImapClient = require("emailjs-imap-client");
var mailparser_1 = require("mailparser");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var Worker = /** @class */ (function () {
    function Worker(ktbServerInfo) {
        console.log("IMAP.Worker.constructor", ktbServerInfo);
        Worker.serverInfo = ktbServerInfo;
    }
    Worker.prototype.connectToServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new ImapClient.default(Worker.serverInfo.imap.host, Worker.serverInfo.imap.port, { auth: Worker.serverInfo.imap.auth });
                        client.logLevel = client.LOG_LEVEL_NONE;
                        client.onerror = function (ktbError) {
                            console.log("IMAP.Worker.listMailboxes(): Connection error", ktbError);
                        };
                        return [4 /*yield*/, client.connect()];
                    case 1:
                        _a.sent();
                        console.log("IMAP.Worker.listMailboxes(): Connected");
                        return [2 /*return*/, client];
                }
            });
        });
    };
    Worker.prototype.listMailboxes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, mailboxes, finalMailboxes, iterateChildren;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("IMAP.Worker.listMailboxes()");
                        return [4 /*yield*/, this.connectToServer()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.listMailboxes()];
                    case 2:
                        mailboxes = _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 3:
                        _a.sent();
                        finalMailboxes = [];
                        iterateChildren = function (ktbArray) {
                            ktbArray.forEach(function (ktbValue) {
                                finalMailboxes.push({
                                    name: ktbValue.name, path: ktbValue.path
                                });
                                iterateChildren(ktbValue.children);
                            });
                        };
                        iterateChildren(mailboxes.children);
                        return [2 /*return*/, finalMailboxes];
                }
            });
        });
    };
    Worker.prototype.listMessages = function (ktbCallOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var client, mailbox, messages, finalMessages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("IMAP.Worker.listMessages()", ktbCallOptions);
                        return [4 /*yield*/, this.connectToServer()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.selectMailbox(ktbCallOptions.mailbox)];
                    case 2:
                        mailbox = _a.sent();
                        if (!(mailbox.exists === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, client.close()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 4: return [4 /*yield*/, client.listMessages(ktbCallOptions.mailbox, "1:*", ["uid", "envelope"])];
                    case 5:
                        messages = _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 6:
                        _a.sent();
                        finalMessages = [];
                        finalMessages.forEach(function (ktbValue) {
                            finalMessages.push({
                                id: ktbValue.uid, date: ktbValue.envelope.date,
                                from: ktbValue.envelope.from[0].address,
                                subject: ktbValue.envelope.subject
                            });
                        });
                        return [2 /*return*/, finalMessages];
                }
            });
        });
    };
    Worker.prototype.getMessageBody = function (ktbCallOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var client, messages, parsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("IMAP.Worker.getMessageBody()", ktbCallOptions);
                        return [4 /*yield*/, this.connectToServer()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.listMessages(ktbCallOptions.mailbox, ktbCallOptions.id, ["body[]"], { byUid: true })];
                    case 2:
                        messages = _a.sent();
                        return [4 /*yield*/, mailparser_1.simpleParser(messages[0]["body[]"])];
                    case 3:
                        parsed = _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, parsed.text];
                }
            });
        });
    };
    Worker.prototype.deleteMessage = function (ktbCallOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("IMAP.Worker.deleteMessage()", ktbCallOptions);
                        return [4 /*yield*/, this.connectToServer()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.deleteMessages(ktbCallOptions.mailbox, ktbCallOptions.id, { byUid: true })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, client.close()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Worker;
}());
exports.Worker = Worker;
//# sourceMappingURL=IMAP.js.map