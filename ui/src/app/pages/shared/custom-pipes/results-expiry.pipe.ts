import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'resultsExpiry',
  pure: true
})
export class ResultsExpiryPipe implements PipeTransform {

  transform(value: string, timeResolved?: any, timeExpired?: any): any {
    return this.resultsExpiry(value, timeResolved, timeExpired);
  }
  resultsExpiry(timeRead: string, timeResolved: string, timeExpired: string): String{
    let output = '';
    if (timeRead && timeResolved && timeExpired){
      if ((moment(timeRead) >= moment(timeResolved)) && (moment(timeRead) <= moment(timeExpired))){
        output = 'Valid'
      }else if(moment(timeRead) < moment(timeResolved)){
        output = 'Captured too early'
      }else if(moment(timeRead) > moment(timeExpired)){
        output = 'Captured too late'
      }
    }
    return output || 'N/A';
  }
}
