import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyRateComponent } from './components/currency-rate/currency-rate.component'; 
import { ApiService } from './api/api.service';
import { Currency } from './entities/currency';
import { Messages } from './enums/messages';
import { Currencies } from './enums/currencies';
import { interval, tap } from 'rxjs';
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

  private api: ApiService;
  public time: Date;

  public loadStatus: boolean = false;
  public loadMessage: string = Messages.LOAD;

  private currentCurrencies: string[] = [
    Currencies.USD,
    Currencies.EUR,
    Currencies.GBR
  ]

  //TODO remove temp data
  public rates: Currency[] = [
    new Currency(Currencies.USD, 1.23),
    new Currency(Currencies.EUR, 1.23),
    new Currency(Currencies.GBR, 1.23),
    new Currency(Currencies.CNY, 1.23),
    new Currency(Currencies.JPY, 1.23),
    new Currency(Currencies.TRY, 1.23)
  ];

  constructor(private apiService: ApiService) {
    this.api = apiService;
    this.time = new Date();
  }

  ngOnInit(): void {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    interval(5000).pipe(
      tap(() => this.getAndUpdateRates())
    );
  }

  public addCurrency(): void {
    //! Temp cond
    if (this.rates.length <= 6) {
      this.rates.push(new Currency(Currencies.TRY, 1.23))
    }
  }

  public removeCurrency(): void {
    // if (this.currentCurrencies.length >= 3) {
    //   this.currentCurrencies.pop();
    // }
    //! Temp cond
    if (this.rates.length >= 3) {
      this.rates.pop();
    }
  }

  public getAndUpdateRates(): void {
    this.api.getCurrenciesRate().subscribe({
      next: (data: Currency[]) => {
        this.rates = data;
        this.loadStatus = false;
        console.log(data);
      }, 
      error: (error: unknown) => {
        console.log(error);
        this.loadMessage = Messages.ERROR;
        this.rates = [];
      }
    })
  }

  public getFormatDate(timestamp: Date = this.time, locale: string = "ru-RU"): string {
    const time = timestamp.toLocaleTimeString(locale);
    const date = timestamp.toLocaleDateString(locale);
    return date + ", " + time;
  }
}
