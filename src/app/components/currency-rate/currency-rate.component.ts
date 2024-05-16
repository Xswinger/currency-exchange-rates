import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-currency-rate',
  standalone: true,
  imports: [NgIf],
  templateUrl: './currency-rate.component.html',
  styleUrl: './currency-rate.component.sass'
})
export class CurrencyRateComponent {

  @Input() currencyName: string = '';
  @Input() currencyRate: number = 0;
  currencyDiff: number = 1.23

  public getFormatCurrency(value: number): string {
    return value.toFixed(2);
  }

}
