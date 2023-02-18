export class Apartment {
    constructor(
    public _id: string,
    public name: string,
    public address: string,
    public aptGender: string,
    public phone: string,
    public url: string,
    public amenities: [string],
    public images: [string],
    public price: number) {}
}