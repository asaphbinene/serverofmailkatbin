"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var ServerInfo_1 = require("./ServerInfo");
var IMAP = __importStar(require("./IMAP"));
var SMTP = __importStar(require("./SMTP"));
var Contacts = __importStar(require("./contacts"));
//import SMTPConnection from "nodemailer/lib/smtp-connection";
var app = express_1.default();
app.use(express_1.default.json());
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
//List of domains with header value as asterisk are allow upper filter
//All call will be verify according to http method allowed
//Lower filter will verify header request
app.use(function (ktbRequest, ktbResponse, ktbNext) {
    ktbResponse.header("Access-Control-Allow-Origin", "*");
    ktbResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    ktbResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    ktbNext();
});
//Getting the list mailboxes
app.get("/mailboxes", function (ktbRequest, ktbResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var imapWorker, mailboxes, ktbError_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET /mailboxes (1)");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, imapWorker.listMailboxes()];
            case 2:
                mailboxes = _a.sent();
                ktbResponse.json(mailboxes);
                return [3 /*break*/, 4];
            case 3:
                ktbError_1 = _a.sent();
                console.log("GET /mailboxes (1)");
                ktbResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/mailboxes/:mailbox", function (ktbRequest, ktbResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var imapWorker, messages, ktbError_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET /mailboxes (2)", ktbRequest.params.mailbox);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, imapWorker.listMessages({
                        mailbox: ktbRequest.params.mailbox
                    })];
            case 2:
                messages = _a.sent();
                console.log("GET /mailboxes (2): OK", messages);
                ktbResponse.json(messages);
                return [3 /*break*/, 4];
            case 3:
                ktbError_2 = _a.sent();
                console.log("GET /mailboxes (2): OK", ktbError_2);
                ktbResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Access specific mailbox and content
app.get("/messages/:mailbox/:id", function (ktbRequest, ktbResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var imapWorker, messageBody, ktbError_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET /messages (3)", ktbRequest.params.mailbox, ktbRequest.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, imapWorker.getMessageBody({
                        mailbox: ktbRequest.params.mailbox,
                        id: parseInt(ktbRequest.params.id, 10)
                    })];
            case 2:
                messageBody = _a.sent();
                console.log("GET /messages (3)", messageBody);
                ktbResponse.send(messageBody);
                return [3 /*break*/, 4];
            case 3:
                ktbError_3 = _a.sent();
                console.log("GET /messages (3)", ktbError_3);
                ktbResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Access to delete message
app.delete("/messages/:mailbox/:id", function (ktbRequest, ktbResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var imapWorker, ktbError_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("DELETE /messages");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, imapWorker.deleteMessage({
                        mailbox: ktbRequest.params.mailbox,
                        id: parseInt(ktbRequest.params.id, 10)
                    })];
            case 2:
                _a.sent();
                console.log("DELETE /messages: Ok");
                ktbResponse.send("ok");
                return [3 /*break*/, 4];
            case 3:
                ktbError_4 = _a.sent();
                console.log("DELETE /messages: Error", ktbError_4);
                ktbResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Sending a message 
app.post("/messages", function (ktbRequest, ktbResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var smtpWorker, ktbError_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("POST /messages", ktbRequest.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                smtpWorker = new SMTP.Worker(ServerInfo_1.serverInfo);
                return [4 /*yield*/, smtpWorker.sendMessage(ktbRequest.body)];
            case 2:
                _a.sent();
                console.log("POST /messages: Ok");
                ktbResponse.send("ok");
                return [3 /*break*/, 4];
            case 3:
                ktbError_5 = _a.sent();
                console.log("POST /messages: Error", ktbError_5);
                ktbResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Accessing list of contacts
app.get("/contacts", function (ktbRequest, ktbResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var contactsWorker, contacts, ktbError_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("GET /contacts");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                contactsWorker = new Contacts.Worker();
                return [4 /*yield*/, contactsWorker.listContacts()];
            case 2:
                contacts = _a.sent();
                console.log("GET /contacts: Ok", contacts);
                ktbResponse.json(contacts);
                return [3 /*break*/, 4];
            case 3:
                ktbError_6 = _a.sent();
                console.log("GET /contacts: Error", ktbError_6);
                ktbResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Adding contact to contacts list
app.post("/contacts", function (ktbRequest, ktbResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var contactsWorker, contact, ktbError_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("POST /contacts", ktbRequest.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                contactsWorker = new Contacts.Worker();
                return [4 /*yield*/, contactsWorker.addContact(ktbRequest.body)];
            case 2:
                contact = _a.sent();
                console.log("POST /contacts: Ok", contact);
                ktbResponse.json(contact);
                return [3 /*break*/, 4];
            case 3:
                ktbError_7 = _a.sent();
                console.log("GET /contacts: Error", ktbError_7);
                ktbResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Deleting a contact
app.delete("/contacts/:id", function (ktbRequest, ktbResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var contactsWorker, ktbError_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("DELETE /contacts", ktbRequest.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                contactsWorker = new Contacts.Worker();
                return [4 /*yield*/, contactsWorker.deleteContact(ktbRequest.params.id)];
            case 2:
                _a.sent();
                console.log("Contact deleted");
                ktbResponse.send("ok");
                return [3 /*break*/, 4];
            case 3:
                ktbError_8 = _a.sent();
                console.log(ktbError_8);
                ktbResponse.send("error");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Start app listening.
app.listen(8080, function () {
    console.log("MailBag server open for requests");
});
//# sourceMappingURL=server.js.map