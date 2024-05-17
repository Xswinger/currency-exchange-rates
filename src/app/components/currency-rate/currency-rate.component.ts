import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Currency } from '../../entities/currency';

@Component({
  selector: 'app-currency-rate',
  standalone: true,
  imports: [NgIf],
  templateUrl: './currency-rate.component.html',
  styleUrl: './currency-rate.component.sass'
})
export class CurrencyRateComponent implements OnChanges {

  @Input() currencyObject!: Currency | undefined;
  currencyDiff: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    const versions = changes["currencyObject"];
    const current  = versions.currentValue;
    const previous = versions.previousValue;
    this.currencyDiff = current.rate - previous.rate;
  }

  public getFormatCurrency(value: number): string {
    return value.toFixed(2);
  }

}
