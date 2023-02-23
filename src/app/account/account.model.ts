export class User {
    constructor(
    public _id: string,
    public fname: string,
    public lname: string,
    public email: string,
    public password: string,
    public salt: string) {}
}