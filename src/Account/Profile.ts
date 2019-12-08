
export class Profile {
    public id: string;
    public userName: String;
    public firstName: string;
    public lastName: string;
    public mobileno: string;
    public emailId: string;
    public address: string;
    public city: string;
    public picture: string;
    public country: string;
    private passowrd: string

    constructor(profileRec: any) {
        this.id = profileRec.id || profileRec._id;
        this.userName = profileRec.userName;
        this.firstName = profileRec.firstName;
        this.lastName = profileRec.lasttName;
        this.mobileno = profileRec.mobileno;
        this.emailId = profileRec.emailId;
        this.address = profileRec.address;
        this.city = profileRec.city;
        this.country = profileRec.country;
        this.picture = profileRec.picture

    }
}