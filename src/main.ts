import path from "path";
import express, { Express, NextFunction, Request, Response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./contacts";
import { IContact } from "./contacts";
//import SMTPConnection from "nodemailer/lib/smtp-connection";

const app: Express = express();

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "../../client/dist")));
//List of domains with header value as asterisk are allow upper filter
//All call will be verify according to http method allowed
//Lower filter will verify header request
app.use(function(ktbRequest: Request, ktbResponse: Response, ktbNext: NextFunction){
    ktbResponse.header("Access-Control-Allow-Origin", "*");
    ktbResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    ktbResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    ktbNext();
})

//Getting the list mailboxes
app.get(
    "/mailboxes",
    async(ktbRequest: Request, ktbResponse: Response) => {
        console.log("GET /mailboxes (1)");
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
            ktbResponse.json(mailboxes);
        } catch(ktbError) {
            console.log("GET /mailboxes (1)");
            ktbResponse.send("error");
        }
    }   
);

app.get(
    "/mailboxes/:mailbox",
    async(ktbRequest: Request, ktbResponse: Response) => {
        console.log("GET /mailboxes (2)", ktbRequest.params.mailbox);
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messages: IMAP.IMessage[] = await imapWorker.listMessages({
                mailbox: ktbRequest.params.mailbox
            });
            console.log("GET /mailboxes (2): OK", messages)
            ktbResponse.json(messages);
        } catch(ktbError) {
            console.log("GET /mailboxes (2): OK", ktbError)
            ktbResponse.send("error");
        }
    }   
);

//Access specific mailbox and content
app.get(
    "/messages/:mailbox/:id",
    async(ktbRequest: Request, ktbResponse: Response) => {
        console.log("GET /messages (3)", ktbRequest.params.mailbox, ktbRequest.params.id);
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string = await imapWorker.getMessageBody(
                {
                    mailbox : ktbRequest.params.mailbox,
                    id : parseInt(ktbRequest.params.id, 10)
                }
            );
            console.log("GET /messages (3)", messageBody);
            ktbResponse.send(messageBody);
        }catch (ktbError){
            console.log("GET /messages (3)", ktbError);
            ktbResponse.send("error");
        }
    }
);

//Access to delete message
app.delete(
    "/messages/:mailbox/:id",
    async(ktbRequest: Request, ktbResponse: Response) => {
        console.log("DELETE /messages");
        try{
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox : ktbRequest.params.mailbox,
                id : parseInt(ktbRequest.params.id, 10)
            });
            console.log("DELETE /messages: Ok");
            ktbResponse.send("ok");
        } catch (ktbError) {
            console.log("DELETE /messages: Error", ktbError);
            ktbResponse.send("error");
        }
    }
);

// Sending a message 
app.post(
    "/messages",
    async (ktbRequest: Request, ktbResponse: Response) => {
        console.log("POST /messages", ktbRequest.body);
        try{
            const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
            await smtpWorker.sendMessage(ktbRequest.body);
            console.log("POST /messages: Ok");
            ktbResponse.send("ok");
        } catch (ktbError) {
            console.log("POST /messages: Error", ktbError);
            ktbResponse.send("error");
        }
    }
);

// Accessing list of contacts
app.get(
    "/contacts",
    async(ktbRequest: Request, ktbResponse: Response) => {
        console.log("GET /contacts");
        try{
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contacts: IContact[] = await contactsWorker.listContacts();
            console.log("GET /contacts: Ok", contacts);
            ktbResponse.json(contacts);
        } catch (ktbError) {
            console.log("GET /contacts: Error", ktbError);
            ktbResponse.send("error");
        }
    }
);

// Adding contact to contacts list
app.post(
    "/contacts",
    async (ktbRequest: Request, ktbResponse: Response) => {
        console.log("POST /contacts", ktbRequest.body);
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.addContact(ktbRequest.body);
            console.log("POST /contacts: Ok", contact);
            ktbResponse.json(contact);
        } catch (ktbError) {
            console.log("GET /contacts: Error", ktbError);
            ktbResponse.send("error");
        }
    }
);

// Deleting a contact
app.delete(
    "/contacts/:id",
    async(ktbRequest: Request, ktbResponse: Response) => {
        console.log("DELETE /contacts", ktbRequest.body);
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            await contactsWorker.deleteContact(ktbRequest.params.id);
            console.log("Contact deleted");
            ktbResponse.send("ok");
        } catch (ktbError) {
            console.log(ktbError);
            ktbResponse.send("error");
        }
    }
);

// Start app listening.
app.listen(8080, () => {
    console.log("MailBag server open for requests");
});

