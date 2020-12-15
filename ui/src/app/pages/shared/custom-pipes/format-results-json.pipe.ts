import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatResultsJson',
  pure: true
})
export class FormatResultsJsonPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    return this.formatResultsJson(value);
  }
  formatResultsJson(results: string): String{
    let resultJson: any;
    resultJson = JSON.parse(results.replace(/'/g, '"'));
    let output = '';
    for (var key in resultJson) {
      output += resultJson[key] + '; ';
    }
    return output || 'N/A';
  }
}
