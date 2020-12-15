import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatDataTime',
  pure: true
})
export class FormatDatetimePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return this.formatDataTime(value);
  }
  formatDataTime(dateTime: string): String{
    let formatedDate:any;
    if (dateTime) {
      formatedDate = moment.utc(dateTime, 'YYYY-MM-DD hh:mm A');
      return moment(formatedDate).local().format('YYYY-MM-DD hh:mm A');
    }
    return formatedDate || 'N/A'
  }
}
