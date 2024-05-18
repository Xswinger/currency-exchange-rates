import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Currency } from '../../entities/currency';

@Component({
  selector: 'app-currency-rate',
  standalone: true,
  imports: [NgIf],
  templateUrl: './currency-rate.component.html',
  styleUrl: './currency-rate.component.sass'
})
export class CurrencyRateComponent {

  @Input() currencyObject!: Currency | undefined;
  currencyDiff: number = 1.23

  public getFormatCurrency(value: number): string {
    return value.toFixed(2);
  }

}
