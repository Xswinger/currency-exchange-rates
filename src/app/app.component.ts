import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyRateComponent } from './components/currency-rate/currency-rate.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyRateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'currency-exchange-rates';
}
