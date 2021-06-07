import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError, map, retry, retryWhen, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { backoff } from '../utils/exponential-backoff';

export interface IWeatherResult {
    current: {
        temp: number
    },
    daily: Array<{
        dt: number,
        temp: {
            day: number
        }
    }>
};

@Injectable()
export class WeatherService {

    constructor(private http: HttpClient) { }

    getParams(): HttpParams {
        return new HttpParams()
            .set("appId", environment.appId)
            .set("lat", environment.lat)
            .set("lon", environment.lon);
    }

    getUrl() {
        return environment.weatherUrl;
    }

    private handleError(error: HttpErrorResponse) {

        error.status === 0 ? console.error('An error occurred:', error.error) : console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);

        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }

    getWeather() {
        return this.http
            .get<IWeatherResult>(this.getUrl(), {
                params: this.getParams()
            })
            .pipe(
                backoff(10, 1000)
            )

    }
}