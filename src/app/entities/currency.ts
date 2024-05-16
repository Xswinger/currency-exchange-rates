export class Currency {

    private name: string;

    private rate: number

    constructor(private currencyName: string, private currencyRate: number) {
        this.name = currencyName;
        this.rate = currencyRate;
    }

    public get getName(): string {
        return this.name;
    }

    public get getRate(): number {
        return this.rate;
    }

    public set setName(newName: string) {
        this.name = newName;
    }

    public set setRate(newRate: number) {
        this.rate = newRate;
    }
    
    
}