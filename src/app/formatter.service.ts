import { Injectable } from '@angular/core';

@Injectable()
export class FormatterService {
  public readonly depthDecimals: number;
  public readonly empty: string;
  public readonly locationDecimals: number;

  constructor () {
    this.depthDecimals = 1;
    this.empty = '&ndash;';
    this.locationDecimals = 3;
  }

  /**
   * Format a UTC date.
   *
   * @param date {Date}
   *     Date to format.
   *
   * @return {String}
   */
  date (date: Date): string {
    let year,
        month,
        day;

    if (!date || typeof date.getTime !== 'function') {
      return this.empty;
    }

    year = date.getUTCFullYear();
    month = date.getUTCMonth() + 1;
    day = date.getUTCDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }

  /**
   * Format a date and time.
   *
   * @param stamp {Date}
   *     Date or millisecond epoch timstamp to format.
   * @param minutesOffset {Number} Optional, default 0
   *     UTC offset in minutes. 0 for UTC.
   * @param includeMilliseconds {Boolean} Optional, default false
   *     Whether to output milliseconds.
   *
   * @return {String}
   */
  dateTime (date: Date, minutesOffset = 0, includeMilliseconds = false) {
    let milliOffset;

    if (date === null || typeof date === 'undefined') {
      return this.empty;
    }

    if (minutesOffset) {
      milliOffset = minutesOffset * 60 * 1000;
      date = new Date(date.getTime() + milliOffset);
    }

    return this.date(date) + ' ' + this.time(date, includeMilliseconds) +
        ' (UTC' + this.timezoneOffset(minutesOffset) + ')';
  }

  /**
   * Format a depth.
   *
   * @param depth {Number}
   *     Depth to format
   * @param units {String} Optional, default none
   *     Depth units, if any.
   * @param error {Number} Optional, default none
   *     Depth error, if any.
   *
   * @return {String}
   */
  depth (depth: number, units?: string, precision?: number, error?: number) {
    let number,
        uncertainty;

    precision = precision ? precision : this.depthDecimals;
    number = this.number(depth, precision, this.empty, units);
    uncertainty = this.uncertainty(error, precision, '');

    return number + uncertainty;
  }

  /**
   * Format a latitude
   *
   * @param latitude {Number}
   *     The latitude.
   * @param decimals Optional, default this.locationDecimals
   *     The number of decimals to include in the formatted output.
   *
   * @return {String}
   */
  latitude (latitude: number, decimals = this.locationDecimals): string {
    let latDir,
        result;

    if (latitude === null || typeof latitude === 'undefined') {
      return this.empty;
    }

    latDir = (latitude >= 0 ? 'N' : 'S');

    // already have sign information, abs and round
    result = this.number(Math.abs(latitude), decimals);

    return `${result}&deg;${latDir}`;
  }

  /**
   * Format a latitude and longitude.
   *
   * @param latitude {Number}
   *     The latitude.
   * @param longitude {Number}
   *     The longitude.
   * @param decimals {Number} Optional, default this.locationDecimals
   *     The number of decimals to include in the formatted output.
   *
   * @return {String}
   */
  location (latitude: number, longitude: number,
      decimals = this.locationDecimals): string {
    return this.latitude(latitude, decimals) + '&nbsp;' +
        this.longitude(longitude, decimals);
  }

  /**
   * Format a longitude
   *
   * @param longitude {Number}
   *     The longitude.
   * @param decimals Optional, default this.locationDecimals
   *     The number of decimals to include in the formatted output.
   *
   * @return {String}
   */
  longitude (longitude: number, decimals = this.locationDecimals): string {
    let lngDir,
        result;

    if (longitude === null || typeof longitude === 'undefined') {
      return this.empty;
    }

    lngDir = (longitude >= 0 ? 'E' : 'W');

    // already have sign information, abs and round
    result = this.number(Math.abs(longitude), this.locationDecimals);


    return `${result}&deg;${lngDir}`;
  }

  /**
   * Format a number.
   *
   * @param value {Number}
   *     Number to format.
   * @param decimals {Number} Optional, default does not round.
   *     Number of decimal places to round.
   * @param empty {Any} Optional, default none.
   *     Value to return if value is empty.
   * @param units {String} Optional, default none.
   *     Units of value.
   *
   * @return {String}
   */
  number (value: number, decimals?: number, empty = this.empty,
      units = ''): string {
    let factor,
        result;

    if (!value && value !== 0) {
      return empty;
    }

    if (typeof decimals === 'number') {
      factor = Math.pow(10, decimals);
      result = (Math.round(value * factor) / factor).toFixed(decimals);
    } else {
      result = `${value}`;
    }

    if (units) {
      result += ' ' + units;
    }

    return result;
  }

  /**
   * Format a UTC time.
   *
   * @param date {Date}
   *     Date to format.
   * @param includeMilliseconds {Boolean} Optional, default false.
   *     Whether to output milliseconds.
   *
   * @return {String}
   */
  time (date: Date, includeMilliseconds = false): string {
    let hours,
        minutes,
        seconds,
        milliseconds;

    if (!date) {
      return this.empty;
    }

    hours = date.getUTCHours();
    minutes = date.getUTCMinutes();
    seconds = date.getUTCSeconds();
    milliseconds = '';

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    if (includeMilliseconds) {
      milliseconds = date.getUTCMilliseconds();
      if (milliseconds < 10) {
        milliseconds = '.00' + milliseconds;
      } else if (milliseconds < 100) {
        milliseconds = '.0' + milliseconds;
      } else {
        milliseconds = '.' + milliseconds;
      }
    }

    return `${hours}:${minutes}:${seconds}${milliseconds}`;
  }

  /**
   * Format a UTC timezone offset.
   *
   * @param offset {Number} Optional, default 0
   *     UTC offset in minutes. 0 for UTC.
   *
   * @return {String}
   */
  timezoneOffset (offset = 0): string {
    let hours,
        minutes,
        sign;

    if (!offset || offset === 0) {
      return '';
    } else if (offset < 0) {
      sign = '-';
      offset *= -1;
    } else {
      sign = '+';
    }

    hours = parseInt('' + (offset / 60), 10);
    minutes = parseInt('' + (offset % 60), 10);

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    return `${sign}${hours}:${minutes}`;
  }

  /**
   * Format an uncertainty.
   *
   * @param error {Number}
   *     Uncertainty to format.
   * @param decimals {Number} Optional, default does not round.
   *     Number of decimal places to round.
   * @param empty {Any}
   *     Value to return if error is empty.
   * @param units {String} Optional, default none.
   *     Units of error.
   *
   * @return {String} formatted string.
   */
  uncertainty (error: number, decimals: number, empty = this.empty,
      units?: string): string {
    let result;

    if (!error && error !== 0) {
      return empty;
    }

    result = this.number(error, decimals, null, units);
    return `<span class="uncertainty">&plusmn; ${result}</span>`;
  }
}
