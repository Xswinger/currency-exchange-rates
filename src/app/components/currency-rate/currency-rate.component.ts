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
    if (versions.previousValue) {
      this.currencyDiff = current.getRate - versions.previousValue.getRate;
    } else {
      this.currencyDiff = 0;
    }
  }

  public getFormatCurrency(value: number): string {
    return value.toFixed(2);
  }

}
