import { Injectable } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Currency } from "../entities/currency";


@Injectable( {providedIn: 'root'} )
export class ApiService {
    
    private readonly baseUrl: string = 'https://api.apilayer.com/currency_data/live?';

    private http: HttpClient;
    private options: object;

    constructor(private httpClient: HttpClient) {
        this.http = httpClient;
        this.options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'apikey': 'JJvc2NfVvkkRwx5jd9w2Qot1lHe6VOfZ',
            })
        };
    }

    //TODO add params for request
    //TODO replace handling logic in special func
    public getCurrenciesRate(): Observable<Currency[]> {
        // let response = {
        //     "quotes": {"EURRUB": 99.102629},
        //     "source": "EUR",
        //     "success": true,
        //     "timestamp": 1715783343
        // }
        return this.http.get(this.baseUrl).pipe(
            map((data: unknown) => {
                if (data) {
                    const currenciesObject: object = Object.entries(data)[0];
                    return Object.entries(currenciesObject).map((key, value): Currency => {
                        return new Currency(String(key.slice(3)), value);
                    })
                } else {
                    throw Error("Quotes property not found");
                }
            }), catchError(error => {
                console.log(error);
                return [];
            })
        );
    }

}