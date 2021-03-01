import { Component, OnDestroy } from '@angular/core';
import { ProgressInfo, StatsProgressBarData } from '../../../@core/data/stats-progress-bar';
import {filter, takeWhile} from 'rxjs/operators';
import {UserActivityData} from '../../../@core/data/user-activity';
import {SharedService} from '../../../shared.service';

@Component({
  selector: 'ngx-stats-progress-section',
  styleUrls: ['./stats-progress-section.component.scss'],
  templateUrl: './stats-progress-section.component.html',
})
export class StatsProgressSectionComponent implements OnDestroy {

  private alive = true;

  positivityRateByDomain: any = [];
  progressInfoData: ProgressInfo[];

  constructor(private statsProgressBarService: StatsProgressBarData, private sharedService: SharedService) {
    this.statsProgressBarService.getProgressInfoData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.progressInfoData = data;
      });

    this.sharedService.globalStats
      .pipe(filter(results => !!results.data))
      .subscribe(result => {
        this.positivityRateByDomain = result.data.positivity_rate_by_domain;
      });
  }

  generatePositivityRateDescription(positive_readings, total_readings){
    let rate = positive_readings/total_readings
    let output = ''
    switch (true) {
      case rate<=0.2: output= 'Mostly negative readings.'; break;
      case (0.2<rate) && (rate<=0.35): output= 'Slightly increased positivity rate.'; break;
      case (rate>0.35) && (rate<=0.65): output= 'High positivity rate.'; break;
      case (rate>0.65): output= 'Very high positivity rate.'; break;
    }
    return output
  }

  ngOnDestroy() {
    this.alive = true;
  }
}
