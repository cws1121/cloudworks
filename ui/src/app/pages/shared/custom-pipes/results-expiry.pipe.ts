import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'resultsExpiry',
  pure: true
})
export class ResultsExpiryPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return this.resultsExpiry(value, args);
  }
  resultsExpiry(timeResolved: string, timeExpired: string): String{
    let output = '';
    if (timeResolved && timeExpired){
      output = moment(timeResolved) > moment(timeExpired) ? 'Yes' : 'No'
    }
    return output || 'N/A';
  }
}
