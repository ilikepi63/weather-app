import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemperatureType } from './types/weather-item-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';
  temp: BehaviorSubject<TemperatureType> = new BehaviorSubject<TemperatureType>("C");
  toggleTemp = () => this.temp.next(this.temp.getValue() === "C" ? "F" : "C");
}
