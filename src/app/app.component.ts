import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyRateComponent } from './components/currency-rate/currency-rate.component'; 
import { ApiService } from './api/api.service';
import { Currency } from './entities/currency';
import { Messages } from './enums/messages';
import { Currencies } from './enums/currencies';
import { Subscription, forkJoin, repeat } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyRateComponent, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {

  /*
  Объекты валют и список отображаемых пользователю
  валют резделены на разные property. Из-за этого
  для отображения только показываемых currency,
  список которых находится в showingCurrencies,
  используется ручное пересоздание компонентов  
  после каждого изменения количества отображаемых
  валют
  */
  @ViewChild('viewCont', {static: true, read: ViewContainerRef}) viewCont: ViewContainerRef;

  @ViewChild('viewTempl', {static: true, read: TemplateRef}) templRef: TemplateRef<unknown>;

  childViewRef: ViewRef;

  title = 'currency-exchange-rates';

  public time: Date = new Date();

  public loadStatus: boolean = true;
  public loadMessage: string = Messages.LOAD;

  public readonly showingCurrencies: string[] = [
    Currencies.USD,
    Currencies.EUR,
    Currencies.GBP
  ];

  private currenciesSubscription: Subscription;

  public rates: Map<string, Currency> = new Map([]);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    this.subscribeGettingAndUpdatingRates();
  }

  public addCurrency(): void {
    this.unsubscribeGettingCurrency();

    const showingLen = this.showingCurrencies.length;
    const currenciesKeys = Object.keys(Currencies);

    if (showingLen <= currenciesKeys.length) {
      const ind = currenciesKeys.indexOf(this.showingCurrencies[showingLen-1]);
      this.showingCurrencies.push(currenciesKeys[ind + 1]);
    }

    this.subscribeGettingAndUpdatingRates();
  }

  public removeCurrency(): void {
    this.unsubscribeGettingCurrency();

    if (this.showingCurrencies.length >= 1) {
      this.showingCurrencies.pop();
    }

    this.subscribeGettingAndUpdatingRates();
  }

  private subscribeGettingAndUpdatingRates(): void {
    this.currenciesSubscription = forkJoin(this.showingCurrencies.map(
      currency => this.api.getCurrencyRate(currency)
    )).pipe(
      repeat({delay: 5000})
    ).subscribe(
      {
        next: (data: Currency[][]) => {
          data.forEach(item => {
            this.rates.set(item[0].name, item[0]);
          })
          this.loadStatus = false;
          this.reloadChildView();
          console.log(data);
        },
        error: (error: Error) => {
          this.errorHandling(Number(error.message));
          console.log(error);
        }
      }
    );
  }

  private errorHandling(code: number) {
    if (Number(code) != 429) {
      this.loadMessage = Messages.ERROR;
    } else {
      this.loadMessage = Messages.KEY_EXP;
    }
    this.loadStatus = true;
  }

  private unsubscribeGettingCurrency(): void {
    this.currenciesSubscription.unsubscribe();
  }

  public getCurrenciesArray(name: string): Currency | undefined {
    return this.rates.get(name);
  }

  public getFormatDate(timestamp: Date = this.time, locale: string = "ru-RU"): string {
    const time = timestamp.toLocaleTimeString(locale);
    const date = timestamp.toLocaleDateString(locale);
    return date + ", " + time;
  }

  private insertChildView(){
    if (this.viewCont) {
      console.log(this.viewCont);
      this.viewCont.insert(this.childViewRef);
    }
  }

  private removeChildView(){
    if (this.viewCont) {
      this.viewCont.detach();
    }
  }

  private reloadChildView(){
    this.removeChildView();
    this.insertChildView();
  }
}
