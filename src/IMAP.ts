import { ParsedMail } from "mailparser";
const ImapClient = require("emailjs-imap-client");
import { simpleParser } from "mailparser";
import { IServerInfo } from "./ServerInfo";

export interface ICallOptions {
    mailbox : string,
    id?: Number
}

export interface IMessage {
    id : string, 
    date : string,
    from : string,
    subject : string, 
    body?: string
}

export interface IMailbox { 
    name : string, 
    path: string 
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export class Worker {

    private static serverInfo: IServerInfo;

    constructor(ktbServerInfo: IServerInfo) {

        console.log("IMAP.Worker.constructor", ktbServerInfo);
        Worker.serverInfo = ktbServerInfo;
    }

    private async connectToServer(): 
    Promise<any> {
        const client: any = new ImapClient.default(
            Worker.serverInfo.imap.host,
            Worker.serverInfo.imap.port,
            { auth : Worker.serverInfo.imap.auth }
        );

        client.logLevel = client.LOG_LEVEL_NONE;
        client.onerror = (ktbError: Error) => {
            console.log(
                "IMAP.Worker.listMailboxes(): Connection error",
                ktbError
            );
        }

        await client.connect();
        console.log("IMAP.Worker.listMailboxes(): Connected");
        return client;
    }

    public async listMailboxes(): 
    Promise<IMailbox[]> {
        console.log("IMAP.Worker.listMailboxes()");
        const client : any = await this.connectToServer();
        const mailboxes : any = await client.listMailboxes();
        await client.close();
        const finalMailboxes : IMailbox[] = [];
        const iterateChildren : Function = ( ktbArray : any[]): void => {
            ktbArray.forEach((ktbValue : any ) => {
                finalMailboxes.push({
                    name : ktbValue.name, path : ktbValue.path
                });
                iterateChildren(ktbValue.children);
            });
        };
        iterateChildren(mailboxes.children);
        return finalMailboxes;
    }

    public async listMessages(ktbCallOptions: ICallOptions): 
    Promise<IMessage[]> {

        console.log("IMAP.Worker.listMessages()", ktbCallOptions);
        const client : any = await this.connectToServer();
        const mailbox : any = await client.selectMailbox(ktbCallOptions.mailbox);

        if(mailbox.exists === 0 ) {
            await client.close();
            return [];
        }

        const messages : any[] = await client.listMessages(
            ktbCallOptions.mailbox, "1:*", ["uid", "envelope"]
        );

        await client.close();
        const finalMessages: IMessage[] = [];
        finalMessages.forEach((ktbValue : any) => {
            finalMessages.push({
                id : ktbValue.uid, date : ktbValue.envelope.date,
                from : ktbValue.envelope.from[0].address,
                subject : ktbValue.envelope.subject
            });
        });
        return finalMessages;
    }

    public async getMessageBody(ktbCallOptions: ICallOptions): 
    Promise<any> {
        
        console.log("IMAP.Worker.getMessageBody()", ktbCallOptions);
        const client: any = await this.connectToServer();
        const messages: any[] = await client.listMessages(
            ktbCallOptions.mailbox,
            ktbCallOptions.id,
            [ "body[]" ], 
            { byUid : true }
        );

        const parsed: ParsedMail = await simpleParser(messages[0]["body[]"]);
        await client.close();
        return parsed.text;
    }

    public async deleteMessage(ktbCallOptions: ICallOptions):
    Promise<any> {
        console.log("IMAP.Worker.deleteMessage()", ktbCallOptions);
        const client: any = await this.connectToServer();
        await client.deleteMessages(
            ktbCallOptions.mailbox, ktbCallOptions.id, { byUid : true }
        );
        await client.close();
    }
}