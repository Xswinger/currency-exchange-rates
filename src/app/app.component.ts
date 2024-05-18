import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyRateComponent } from './components/currency-rate/currency-rate.component'; 
import { ApiService } from './api/api.service';
import { Currency } from './entities/currency';
import { Messages } from './enums/messages';
import { Currencies } from './enums/currencies';
import { from, mergeMap } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyRateComponent, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {

  title = 'currency-exchange-rates';

  public api: ApiService;

  public time: Date;

  public loadStatus: boolean = true;
  public loadMessage: string = Messages.LOAD;

  public showingCurrencies: string[] = [
    Currencies.USD,
    Currencies.EUR,
    Currencies.GBP
  ]

  public rates: Map<string, Currency> = new Map([]);

  constructor(private apiService: ApiService) {
    this.api = apiService;
    this.time = new Date();
  }

  ngOnInit(): void {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.getAndUpdateRates();
  }

  public addCurrency(): void {
    const len = this.showingCurrencies.length;
    if (len <= 6) {
      const ind = Object.keys(Currencies).indexOf(this.showingCurrencies[len-1]);
      this.showingCurrencies.push(Object.keys(Currencies)[ind + 1]);
      console.log(this.showingCurrencies)
    }
  }

  public removeCurrency(): void {
    if (this.showingCurrencies.length >= 3) {
      this.showingCurrencies.pop();
    }
  }

  public getAndUpdateRates(): void {
    from(Object.values(Currencies)).pipe(
      mergeMap(currency => {
        return this.api.getCurrencyRate(currency);
      })
      //, repeat({ delay: 5000 })
    ).subscribe({
      next: (data: Currency[]) => {
        data.forEach(item => {
          this.rates.set(item.getName, item);
        })
        this.loadStatus = false;
        console.log(data);
      },
      error: (error: unknown) => {
        console.log(error);
        this.loadMessage = Messages.ERROR;
      }
    });
  }

  public getCurrenciesArray(name: string): Currency | undefined {
    return this.rates.get(name);
  }

  public getFormatDate(timestamp: Date = this.time, locale: string = "ru-RU"): string {
    const time = timestamp.toLocaleTimeString(locale);
    const date = timestamp.toLocaleDateString(locale);
    return date + ", " + time;
  }
}
