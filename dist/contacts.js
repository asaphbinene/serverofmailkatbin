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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
var path = __importStar(require("path"));
var Datastore = require("nedb");
var Worker = /** @class */ (function () {
    function Worker() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contatcs.db"),
            autoload: true
        });
    }
    Worker.prototype.listContacts = function () {
        var _this = this;
        console.log("Contacts.Worker.listContacts()");
        return new Promise(function (ktbResolve, ktbReject) {
            _this.db.find({}, function (ktbError, ktbDocs) {
                if (ktbError) {
                    console.log("Contacts.Worker.listContacts(): Error", ktbError);
                    ktbReject(ktbError);
                }
                else {
                    console.log("Contacts.Worker.listContacts(): Error", ktbDocs);
                    ktbResolve(ktbDocs);
                }
            });
        });
    };
    Worker.prototype.addContact = function (ktbContact) {
        var _this = this;
        return new Promise(function (ktbResolve, ktbReject) {
            _this.db.insert(ktbContact, function (ktbError, ktbNewDoc) {
                if (ktbError) {
                    console.log("Contacts.Worker.addContact(): Error", ktbError);
                    ktbReject(ktbError);
                }
                else {
                    console.log("Contacts.Worker.addContact(): ok", ktbNewDoc);
                    ktbResolve(ktbNewDoc);
                }
            });
        });
    };
    Worker.prototype.deleteContact = function (ktbID) {
        var _this = this;
        console.log("Contacts.Worker.deleteContact()", ktbID);
        return new Promise(function (ktbResolve, ktbReject) {
            _this.db.remove({ _id: ktbID }, {}, function (ktbError, ktbNumRemoved) {
                if (ktbError) {
                    console.log("Contacts.Worker.deleteContact(): Error", ktbError);
                    ktbReject(ktbError);
                }
                else {
                    console.log("Contacts.Worker.deleteContact(): ok", ktbNumRemoved);
                    ktbResolve(ktbID);
                }
            });
        });
    };
    return Worker;
}());
exports.Worker = Worker;
//# sourceMappingURL=contacts.js.map