import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyRateComponent } from './components/currency-rate/currency-rate.component'; 
import { ApiService } from './api/api.service';
import { Currency } from './entities/currency';
import { Messages } from './enums/messages';
import { Currencies } from './enums/currencies';
import { forkJoin, from, mergeMap, repeat } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyRateComponent, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  @ViewChild('vc', {static: true, read: ViewContainerRef}) vc!: ViewContainerRef;

  @ViewChild('tpl', {static: true, read: TemplateRef}) tpl!: TemplateRef<unknown>;

  childViewRef!: ViewRef;

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
    const currenciesNames = Object.values(Currencies);

    from(currenciesNames).pipe(
      mergeMap(() => {
        return forkJoin(
          currenciesNames.map(currency => this.api.getCurrencyRate(currency))
        );
      })
      , repeat({ delay: 5000 })
    ).subscribe({
      next: (data: Currency[][]) => {
        data.forEach(item => {
          this.rates.set(item[0].getName, item[0]);
        })
        this.loadStatus = false;
        this.reloadChildView();
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

  insertChildView(){
    if (this.vc) {
      console.log(this.vc);
      this.vc.insert(this.childViewRef);
    }
  }

  removeChildView(){
    if (this.vc) {
      this.vc.detach();
    }
  }

  reloadChildView(){
    this.removeChildView();
    this.insertChildView();
  }
}
