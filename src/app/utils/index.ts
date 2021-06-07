
import { utcToZonedTime } from "date-fns-tz"

const SAST_TIMEZONE = "Africa/Johannesburg";

const ABSOLUTE_ZERO = 273.15;

const convertTimeToDisplay = (str: number) => ("0" + str).substring(-2);

export const dateToString = (date: Date): string => {

    const day: string = convertTimeToDisplay(date.getDay() + 1);

    const month = convertTimeToDisplay(date.getMonth());

    const year = date.getFullYear();

    const hours = date.getHours();

    const minutes = ("0" + date.getMinutes()).substring(-2);

    return `${day}-${month}-${year}, ${hours}:${minutes}`;

};

export const unixToDate = (unixTimeStamp: number) => new Date(unixTimeStamp * 1000);

export const dateToSAST = (date: Date) => utcToZonedTime(date, SAST_TIMEZONE);

// temperature utils

export const kelvinToCelsius = (kelvin: number): number => Math.round((kelvin - ABSOLUTE_ZERO));

export const celsiusToFahrenheit = (celsius: number): number => Math.round(((celsius * 1.8) + 32));

export const kelvinToFahrenheit = (kelvin: number): number => celsiusToFahrenheit(kelvinToCelsius(kelvin));

export const isWithinNormalRange = (tempInCelsius: number): boolean => 15 < tempInCelsius && tempInCelsius < 25;

export const isCold = (tempInCelsius: number): boolean => 15 > tempInCelsius;

export const isHot = (tempInCelsius: number): boolean => tempInCelsius > 25;