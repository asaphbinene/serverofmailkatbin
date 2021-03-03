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
var nodemailer = __importStar(require("nodemailer"));
var Worker = /** @class */ (function () {
    function Worker(ktbServerInfo) {
        console.log("SMTP.Worker.constructor", ktbServerInfo);
        Worker.serverInfo = ktbServerInfo;
    }
    Worker.prototype.sendMessage = function (ktbOptions) {
        console.log("SMTP.Worker.sendMessage()", ktbOptions);
        return new Promise(function (ktbResolve, ktbReject) {
            var transport = nodemailer.createTransport(Worker.serverInfo.smtp);
            transport.sendMail(ktbOptions, function (ktbError, ktbInfo) {
                if (ktbError) {
                    ktbReject(ktbError);
                }
                else {
                    ktbResolve(ktbInfo);
                }
            });
        });
    };
    return Worker;
}());
exports.Worker = Worker;
//# sourceMappingURL=SMTP.js.map