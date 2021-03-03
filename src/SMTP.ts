import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
import { IServerInfo } from "./ServerInfo";

export class Worker {
    private static serverInfo: IServerInfo;
    constructor(ktbServerInfo: IServerInfo) {
        console.log("SMTP.Worker.constructor", ktbServerInfo);
        Worker.serverInfo = ktbServerInfo;
    }

    public sendMessage(ktbOptions: SendMailOptions):
    Promise<string> {
        console.log("SMTP.Worker.sendMessage()", ktbOptions);
        return new Promise((ktbResolve, ktbReject) => {
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);
            transport.sendMail(
              ktbOptions,
              (ktbError: Error | null, ktbInfo: SentMessageInfo) => {
                if(ktbError){
                    ktbReject(ktbError);
                }else {
                    ktbResolve(ktbInfo);
                }
            });
        });
    }
}