import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, interval, of, Subject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { catchError, map, mergeMap, pairwise, tap } from 'rxjs/operators';
import { TemperatureType, WeatherItemType } from '../types/weather-item-type';
import { unixToDate, dateToSAST, dateToString, kelvinToFahrenheit, kelvinToCelsius, isWithinNormalRange, isHot } from '../utils';
import { backoff } from '../utils/exponential-backoff';
import { IWeatherResult, WeatherService } from '../weather-service';

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  providers: [WeatherService],
  styleUrls: ['./weather-list.component.css']
})

export class WeatherListComponent implements OnInit, OnDestroy {

  weatherItems: Array<WeatherItemType> = [];
  weatherSubscription?: Subscription;
  @Input() temp!: BehaviorSubject<TemperatureType>;
  currentTemp: BehaviorSubject<number> = new BehaviorSubject(-1);
  currentTempSubscription?: Subscription;


  constructor(private weatherService: WeatherService, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.subscribeToWeatherService();
    this.setTwentyMinuteRefresh();
  }

  ngOnDestroy(): void {
    this.weatherSubscription?.unsubscribe();
    this.currentTempSubscription?.unsubscribe();
  }

  convertTemp(kelvinTemp: number, type: TemperatureType): number {
    return type === "F" ? kelvinToFahrenheit(kelvinTemp) : kelvinToCelsius(kelvinTemp);
  }

  alert(message: string) {
    this.snackBar.open(message, "OK");
  }

  setTwentyMinuteRefresh() {
    interval(1000 * 60 ^ 20).subscribe(() => {
      this.subscribeToWeatherService();
    })
  }

  subscribeToCurrentTemp() {

    this.currentTempSubscription = this.currentTemp
      .pipe(
        pairwise(),
        map(([prevTemp, currentTemp]) => [prevTemp === -1 ? null : kelvinToCelsius(prevTemp), kelvinToCelsius(currentTemp)])
      )
      .subscribe(([previousTemp, currentTemp]) => {

        // assigning a subscription because this may change

        if (typeof previousTemp !== "number" || typeof currentTemp !== "number") return;

        // we need to ensure that the temperature has changed from normal to not normal
        if (isWithinNormalRange(previousTemp) &&
          !isWithinNormalRange(currentTemp)) {

          isHot(currentTemp) ? this.alert("The current weather has become hot!") : this.alert("The current weather has become cold!");

        };

      });
  }

  subscribeToWeatherService() {
    this.weatherSubscription = this.weatherService
      .getWeather()
      .pipe(
        tap((result) => this.currentTemp.next((result as IWeatherResult).current.temp)),
        mergeMap(result => combineLatest([of(result), this.temp])),
        map(([result, degree]) => (result as IWeatherResult).daily.map(daily => ({
          displayTime: dateToString(dateToSAST(unixToDate(daily.dt))),
          displayTemperature: String(this.convertTemp(daily.temp.day, degree))
        })))
      )
      .subscribe((res) => this.weatherItems = res)


    this.subscribeToCurrentTemp();
  }

}
