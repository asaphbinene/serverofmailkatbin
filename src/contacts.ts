import * as path from "path";
const Datastore = require("nedb");

export interface IContact {
    _id?: number,
    name : string,
    email : string
}

export class Worker {

    private db : Nedb;

    constructor() {
        this.db = new Datastore ({
            filename : path.join(__dirname, "contatcs.db"),
            autoload : true
        });
    }

    public listContacts():
    Promise<IContact[]> {

        console.log("Contacts.Worker.listContacts()");

        return new Promise((ktbResolve, ktbReject) => {
            this.db.find(
                {}, 
                (ktbError: Error, ktbDocs: IContact[]) => {
                    if(ktbError) {
                        console.log("Contacts.Worker.listContacts(): Error", ktbError);
                        ktbReject(ktbError);
                    } else {
                        console.log("Contacts.Worker.listContacts(): Error", ktbDocs);
                        ktbResolve(ktbDocs)
                    }
                }
            );
        });
    }

    public addContact(ktbContact: IContact):
    Promise<IContact> {
        return new Promise((ktbResolve, ktbReject) => { 
            this.db.insert(
                ktbContact,
                (ktbError: Error | null, ktbNewDoc: IContact) => {
                    if(ktbError){
                        console.log("Contacts.Worker.addContact(): Error", ktbError);
                        ktbReject(ktbError);
                    } else {
                        console.log("Contacts.Worker.addContact(): ok", ktbNewDoc);
                        ktbResolve(ktbNewDoc);
                    }
                }
            );
        });
    }

    public deleteContact(ktbID: string): 
    Promise<string> {

        console.log("Contacts.Worker.deleteContact()", ktbID);

        return new Promise((ktbResolve, ktbReject) => {
            this.db.remove(
                {_id: ktbID }, 
                { },
                (ktbError: Error | null, ktbNumRemoved: number) => {
                    if (ktbError) {
                        console.log("Contacts.Worker.deleteContact(): Error", ktbError);
                        ktbReject(ktbError);
                    } else {
                        console.log("Contacts.Worker.deleteContact(): ok", ktbNumRemoved);
                        ktbResolve(ktbID);
                    }
                }
            );
        });
    }
}