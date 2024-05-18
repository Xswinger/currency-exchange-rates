import { Injectable } from "@angular/core";
import { Observable, catchError, map } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Currency } from "../entities/currency";


@Injectable( {providedIn: 'root'} )
export class ApiService {
    
    private readonly baseUrl: string = 'https://api.apilayer.com/currency_data/live';

    private options: object;

    constructor(private http: HttpClient) {
        this.options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'apikey': 'pYQnBwiNjj9D7idNoUjo4hmLLK0VO99h'
            })
        };
    }

    public getCurrencyRate(source: string, currencies: string = "RUB"): Observable<Currency[]> {
        const url = `${this.baseUrl}?source=${source}&currencies=${currencies}`;
        return this.http.get(url, this.options).pipe(
            map((data: Object) => {
                if (data) {
                    const currenciesObject: Map<string, number> = new Map(Object.entries(data)).get('quotes');
                    return Object.entries(currenciesObject).map((item): Currency => {
                        return new Currency(String(item[0].slice(0, 3)), item[1]);
                    })
                } else {
                    throw Error("Currency not found");
                }
            }), catchError((error: HttpErrorResponse) => {
                console.log(error.status);
                throw Error(error.status.toString());
            })
        );
    }

}