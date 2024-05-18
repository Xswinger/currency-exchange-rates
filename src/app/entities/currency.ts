export class Currency {

    constructor(private _name: string, private _rate: number) {}

    public get name(): string {
        return this._name;
    }

    public get rate(): number {
        return this._rate;
    }

    public set name(newName: string) {
        this._name = newName;
    }

    public set rate(newRate: number) {
        this._rate = newRate;
    }
    
    
}